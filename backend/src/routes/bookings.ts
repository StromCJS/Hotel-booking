import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Booking from '../models/Booking';
import Room from '../models/Room';
import { authenticateToken, requireCustomer, requireAdmin } from '../middleware/auth';
import { stripe } from '../config/stripe';

const router = Router();

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filter = req.user!.role === 'admin' ? {} : { userId: req.user!.id };

    const count = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('roomId', 'roomNumber type price images')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('roomId', 'roomNumber type price images amenities description');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns this booking or is admin
    if (booking.userId.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create payment intent for booking
router.post(
  '/create-payment-intent',
  authenticateToken,
  requireCustomer,
  [
    body('roomId').isUUID().withMessage('Valid room ID required'),
    body('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    body('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    body('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be 1-10'),
    body('guestName').trim().isLength({ min: 2, max: 100 }).withMessage('Valid guest name required'),
    body('guestEmail').isEmail().withMessage('Valid guest email required'),
    body('guestPhone').notEmpty().withMessage('Guest phone required'),
    body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests too long'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const {
        roomId,
        checkInDate,
        checkOutDate,
        guests,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      } = req.body;

      // Validate dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        return res.status(400).json({
          success: false,
          message: 'Check-in date cannot be in the past',
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({
          success: false,
          message: 'Check-out date must be after check-in date',
        });
      }

      // Find room
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found',
        });
      }

      if (room.status !== 'Available') {
        return res.status(400).json({
          success: false,
          message: 'Room is not available',
        });
      }

      // Check room capacity
      if (guests > room.capacity) {
        return res.status(400).json({
          success: false,
          message: `Room capacity is ${room.capacity} guests maximum`,
        });
      }

      // Check for conflicting bookings
      const conflictingBooking = await Booking.findOne({
        roomId,
        paymentStatus: { $in: ['Pending', 'Confirmed'] },
        $or: [
          {
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn },
          },
        ],
      });

      if (conflictingBooking) {
        return res.status(409).json({
          success: false,
          message: 'Room is not available for selected dates',
        });
      }

      // Calculate total price
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const subtotal = room.price * nights;
      const tax = subtotal * 0.1; // 10% tax
      const total = Math.round((subtotal + tax) * 100); // Convert to cents

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        metadata: {
          roomId,
          userId: req.user!.id,
          checkInDate,
          checkOutDate,
          guests: guests.toString(),
          guestName,
          guestEmail,
          guestPhone,
        },
      });

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: total,
          currency: 'usd',
        },
      });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Confirm booking after successful payment
router.post(
  '/confirm',
  authenticateToken,
  requireCustomer,
  [
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID required'),
    body('roomId').isUUID().withMessage('Valid room ID required'),
    body('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    body('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    body('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be 1-10'),
    body('guestName').trim().isLength({ min: 2, max: 100 }).withMessage('Valid guest name required'),
    body('guestEmail').isEmail().withMessage('Valid guest email required'),
    body('guestPhone').notEmpty().withMessage('Guest phone required'),
    body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests too long'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const {
        paymentIntentId,
        roomId,
        checkInDate,
        checkOutDate,
        guests,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      } = req.body;

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed',
        });
      }

      // Check if booking already exists for this payment
      const existingBooking = await Booking.findOne({ paymentIntentId });

      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: 'Booking already exists for this payment',
        });
      }

      // Calculate total price
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found',
        });
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const subtotal = room.price * nights;
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      // Create booking
      const booking = new Booking({
        userId: req.user!.id,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice: total,
        paymentStatus: 'Confirmed',
        paymentIntentId,
        guestName,
        guestEmail,
        guestPhone,
        guests,
        specialRequests,
      });
      await booking.save();

      // Update room status to occupied
      room.status = 'Occupied';
      await room.save();

      const bookingWithRoom = await Booking.findById(booking._id).populate('roomId', 'roomNumber type price images');

      res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: { booking: bookingWithRoom },
      });
    } catch (error) {
      console.error('Confirm booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Cancel booking (admin only or user's own booking)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [{ model: Room, as: 'room' }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    if (booking.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if booking can be cancelled (not too close to check-in)
    const checkIn = new Date(booking.checkInDate);
    const now = new Date();
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 24 hours before check-in',
      });
    }

    // Update booking status
    await booking.update({ paymentStatus: 'Cancelled' });

    // Update room status back to available
    if (booking.room) {
      await booking.room.update({ status: 'Available' });
    }

    // Process refund if payment was confirmed
    if (booking.paymentIntentId && booking.paymentStatus === 'Confirmed') {
      try {
        await stripe.refunds.create({
          payment_intent: booking.paymentIntentId,
        });
        await booking.update({ paymentStatus: 'Refunded' });
      } catch (refundError) {
        console.error('Refund error:', refundError);
        // Don't fail the cancellation if refund fails
      }
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
