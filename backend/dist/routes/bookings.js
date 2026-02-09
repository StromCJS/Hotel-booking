"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const Booking_1 = __importDefault(require("../models/Booking"));
const Room_1 = __importDefault(require("../models/Room"));
const auth_1 = require("../middleware/auth");
const stripe_1 = require("../config/stripe");
const router = (0, express_1.Router)();
// Get user's bookings
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const whereClause = req.user.role === 'admin' ? {} : { userId: req.user.id };
        const { count, rows: bookings } = await Booking_1.default.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Room_1.default,
                    as: 'room',
                    attributes: ['id', 'roomNumber', 'type', 'price', 'images'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
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
    }
    catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Get booking by ID
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking_1.default.findByPk(id, {
            include: [
                {
                    model: Room_1.default,
                    as: 'room',
                    attributes: ['id', 'roomNumber', 'type', 'price', 'images', 'amenities', 'description'],
                },
            ],
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        // Check if user owns this booking or is admin
        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }
        res.json({
            success: true,
            data: { booking },
        });
    }
    catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Create payment intent for booking
router.post('/create-payment-intent', auth_1.authenticateToken, auth_1.requireCustomer, [
    (0, express_validator_1.body)('roomId').isUUID().withMessage('Valid room ID required'),
    (0, express_validator_1.body)('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    (0, express_validator_1.body)('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    (0, express_validator_1.body)('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be 1-10'),
    (0, express_validator_1.body)('guestName').trim().isLength({ min: 2, max: 100 }).withMessage('Valid guest name required'),
    (0, express_validator_1.body)('guestEmail').isEmail().withMessage('Valid guest email required'),
    (0, express_validator_1.body)('guestPhone').notEmpty().withMessage('Guest phone required'),
    (0, express_validator_1.body)('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests too long'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { roomId, checkInDate, checkOutDate, guests, guestName, guestEmail, guestPhone, specialRequests, } = req.body;
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
        const room = await Room_1.default.findByPk(roomId);
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
        const conflictingBooking = await Booking_1.default.findOne({
            where: {
                roomId,
                paymentStatus: { [sequelize_1.Op.in]: ['Pending', 'Confirmed'] },
                [sequelize_1.Op.or]: [
                    {
                        checkInDate: { [sequelize_1.Op.lt]: checkOutDate },
                        checkOutDate: { [sequelize_1.Op.gt]: checkInDate },
                    },
                ],
            },
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
        const paymentIntent = await stripe_1.stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            metadata: {
                roomId,
                userId: req.user.id,
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
    }
    catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Confirm booking after successful payment
router.post('/confirm', auth_1.authenticateToken, auth_1.requireCustomer, [
    (0, express_validator_1.body)('paymentIntentId').notEmpty().withMessage('Payment intent ID required'),
    (0, express_validator_1.body)('roomId').isUUID().withMessage('Valid room ID required'),
    (0, express_validator_1.body)('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    (0, express_validator_1.body)('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    (0, express_validator_1.body)('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be 1-10'),
    (0, express_validator_1.body)('guestName').trim().isLength({ min: 2, max: 100 }).withMessage('Valid guest name required'),
    (0, express_validator_1.body)('guestEmail').isEmail().withMessage('Valid guest email required'),
    (0, express_validator_1.body)('guestPhone').notEmpty().withMessage('Guest phone required'),
    (0, express_validator_1.body)('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests too long'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { paymentIntentId, roomId, checkInDate, checkOutDate, guests, guestName, guestEmail, guestPhone, specialRequests, } = req.body;
        // Verify payment intent
        const paymentIntent = await stripe_1.stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed',
            });
        }
        // Check if booking already exists for this payment
        const existingBooking = await Booking_1.default.findOne({
            where: { paymentIntentId },
        });
        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: 'Booking already exists for this payment',
            });
        }
        // Calculate total price
        const room = await Room_1.default.findByPk(roomId);
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
        const booking = await Booking_1.default.create({
            userId: req.user.id,
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
        // Update room status to occupied
        await room.update({ status: 'Occupied' });
        const bookingWithRoom = await Booking_1.default.findByPk(booking.id, {
            include: [
                {
                    model: Room_1.default,
                    as: 'room',
                    attributes: ['id', 'roomNumber', 'type', 'price', 'images'],
                },
            ],
        });
        res.status(201).json({
            success: true,
            message: 'Booking confirmed successfully',
            data: { booking: bookingWithRoom },
        });
    }
    catch (error) {
        console.error('Confirm booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Cancel booking (admin only or user's own booking)
router.put('/:id/cancel', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking_1.default.findByPk(id, {
            include: [{ model: Room_1.default, as: 'room' }],
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        // Check permissions
        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
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
                await stripe_1.stripe.refunds.create({
                    payment_intent: booking.paymentIntentId,
                });
                await booking.update({ paymentStatus: 'Refunded' });
            }
            catch (refundError) {
                console.error('Refund error:', refundError);
                // Don't fail the cancellation if refund fails
            }
        }
        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: { booking },
        });
    }
    catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map