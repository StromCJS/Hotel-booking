import { Router, Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import Room from '../models/Room';
import Booking from '../models/Booking';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Get all rooms with optional filtering and pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    query('type').optional().isIn(['Deluxe', 'Suite', 'Executive', 'Presidential']).withMessage('Invalid room type'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
    query('status').optional().isIn(['Available', 'Occupied', 'Cleaning']).withMessage('Invalid status'),
    query('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be positive'),
    query('checkIn').optional().isISO8601().withMessage('Invalid check-in date'),
    query('checkOut').optional().isISO8601().withMessage('Invalid check-out date'),
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

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const skip = (page - 1) * limit;

      const filter: any = {};

      // Apply filters
      if (req.query.type) filter.type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
      if (req.query.capacity) filter.capacity = { $gte: parseInt(req.query.capacity as string) };

      if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
        if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
      }

      // Availability filter based on dates
      if (req.query.checkIn && req.query.checkOut) {
        const checkIn = new Date(req.query.checkIn as string);
        const checkOut = new Date(req.query.checkOut as string);

        // Find rooms that don't have conflicting bookings
        const conflictingBookings = await Booking.find({
          paymentStatus: { $in: ['Pending', 'Confirmed'] },
          $or: [
            {
              checkInDate: { $lt: checkOut },
              checkOutDate: { $gt: checkIn },
            },
          ],
        }).select('roomId');

        const conflictingRoomIds = conflictingBookings.map(b => b.roomId);

        if (conflictingRoomIds.length > 0) {
          filter._id = { $nin: conflictingRoomIds };
        }
      }

      const count = await Room.countDocuments(filter);
      const rooms = await Room.find(filter)
        .sort({ roomNumber: 1 })
        .skip(skip)
        .limit(limit);

      res.json({
        success: true,
        data: {
          rooms,
          pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      console.error('Get rooms error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get room by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.json({
      success: true,
      data: { room },
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create new room (Admin only)
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('roomNumber').notEmpty().withMessage('Room number required'),
    body('type').isIn(['Deluxe', 'Suite', 'Executive', 'Presidential']).withMessage('Invalid room type'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('capacity').isInt({ min: 1, max: 10 }).withMessage('Capacity must be 1-10'),
    body('size').notEmpty().withMessage('Room size required'),
    body('description').notEmpty().withMessage('Description required'),
    body('images').isArray().withMessage('Images must be an array'),
    body('amenities').isArray().withMessage('Amenities must be an array'),
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

      const { roomNumber, type, price, capacity, size, description, images, amenities } = req.body;

      // Check if room number already exists
      const existingRoom = await Room.findOne({ roomNumber });
      if (existingRoom) {
        return res.status(409).json({
          success: false,
          message: 'Room number already exists',
        });
      }

      const room = new Room({
        roomNumber,
        type,
        price,
        capacity,
        size,
        description,
        images,
        amenities,
        status: 'Available',
      });
      await room.save();

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: { room },
      });
    } catch (error) {
      console.error('Create room error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Update room (Admin only)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  [
    param('id').isUUID().withMessage('Valid room ID required'),
    body('roomNumber').optional().notEmpty().withMessage('Room number required'),
    body('type').optional().isIn(['Deluxe', 'Suite', 'Executive', 'Presidential']).withMessage('Invalid room type'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('status').optional().isIn(['Available', 'Occupied', 'Cleaning']).withMessage('Invalid status'),
    body('capacity').optional().isInt({ min: 1, max: 10 }).withMessage('Capacity must be 1-10'),
    body('size').optional().notEmpty().withMessage('Room size required'),
    body('description').optional().notEmpty().withMessage('Description required'),
    body('images').optional().isArray().withMessage('Images must be an array'),
    body('amenities').optional().isArray().withMessage('Amenities must be an array'),
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

      const { id } = req.params;
      const updateData = req.body;

      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found',
        });
      }

      // Check room number uniqueness if being updated
      if (updateData.roomNumber && updateData.roomNumber !== room.roomNumber) {
        const existingRoom = await Room.findOne({ roomNumber: updateData.roomNumber });
        if (existingRoom) {
          return res.status(409).json({
            success: false,
            message: 'Room number already exists',
          });
        }
      }

      Object.assign(room, updateData);
      await room.save();

      res.json({
        success: true,
        message: 'Room updated successfully',
        data: { room },
      });
    } catch (error) {
      console.error('Update room error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Delete room (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if room has active bookings
    const activeBookings = await Booking.find({
      roomId: id,
      paymentStatus: { $in: ['Pending', 'Confirmed'] },
    });

    if (activeBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete room with active bookings',
      });
    }

    await Room.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
