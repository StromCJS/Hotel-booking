"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const Room_1 = __importDefault(require("../models/Room"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all rooms with optional filtering and pagination
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    (0, express_validator_1.query)('type').optional().isIn(['Deluxe', 'Suite', 'Executive', 'Presidential']).withMessage('Invalid room type'),
    (0, express_validator_1.query)('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
    (0, express_validator_1.query)('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
    (0, express_validator_1.query)('status').optional().isIn(['Available', 'Occupied', 'Cleaning']).withMessage('Invalid status'),
    (0, express_validator_1.query)('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be positive'),
    (0, express_validator_1.query)('checkIn').optional().isISO8601().withMessage('Invalid check-in date'),
    (0, express_validator_1.query)('checkOut').optional().isISO8601().withMessage('Invalid check-out date'),
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const whereClause = {};
        // Apply filters
        if (req.query.type)
            whereClause.type = req.query.type;
        if (req.query.status)
            whereClause.status = req.query.status;
        if (req.query.capacity)
            whereClause.capacity = { [sequelize_1.Op.gte]: parseInt(req.query.capacity) };
        if (req.query.minPrice || req.query.maxPrice) {
            whereClause.price = {};
            if (req.query.minPrice)
                whereClause.price[sequelize_1.Op.gte] = parseFloat(req.query.minPrice);
            if (req.query.maxPrice)
                whereClause.price[sequelize_1.Op.lte] = parseFloat(req.query.maxPrice);
        }
        // Availability filter based on dates
        if (req.query.checkIn && req.query.checkOut) {
            const checkIn = req.query.checkIn;
            const checkOut = req.query.checkOut;
            // Find rooms that don't have conflicting bookings
            const conflictingRoomIds = await Booking_1.default.findAll({
                where: {
                    paymentStatus: { [sequelize_1.Op.in]: ['Pending', 'Confirmed'] },
                    [sequelize_1.Op.or]: [
                        {
                            checkInDate: { [sequelize_1.Op.lt]: checkOut },
                            checkOutDate: { [sequelize_1.Op.gt]: checkIn },
                        },
                    ],
                },
                attributes: ['roomId'],
            }).then(bookings => bookings.map(b => b.roomId));
            if (conflictingRoomIds.length > 0) {
                whereClause.id = { [sequelize_1.Op.notIn]: conflictingRoomIds };
            }
        }
        const { count, rows: rooms } = await Room_1.default.findAndCountAll({
            where: whereClause,
            order: [['roomNumber', 'ASC']],
            limit,
            offset,
        });
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
    }
    catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Get room by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room_1.default.findByPk(id);
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
    }
    catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Create new room (Admin only)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('roomNumber').notEmpty().withMessage('Room number required'),
    (0, express_validator_1.body)('type').isIn(['Deluxe', 'Suite', 'Executive', 'Presidential']).withMessage('Invalid room type'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    (0, express_validator_1.body)('capacity').isInt({ min: 1, max: 10 }).withMessage('Capacity must be 1-10'),
    (0, express_validator_1.body)('size').notEmpty().withMessage('Room size required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description required'),
    (0, express_validator_1.body)('images').isArray().withMessage('Images must be an array'),
    (0, express_validator_1.body)('amenities').isArray().withMessage('Amenities must be an array'),
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
        const { roomNumber, type, price, capacity, size, description, images, amenities } = req.body;
        // Check if room number already exists
        const existingRoom = await Room_1.default.findOne({ where: { roomNumber } });
        if (existingRoom) {
            return res.status(409).json({
                success: false,
                message: 'Room number already exists',
            });
        }
        const room = await Room_1.default.create({
            roomNumber,
            type,
            price,
            capacity,
            size,
            description,
            images,
            amenities,
        });
        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: { room },
        });
    }
    catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Update room (Admin only)
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid room ID required'),
    (0, express_validator_1.body)('roomNumber').optional().notEmpty().withMessage('Room number required'),
    (0, express_validator_1.body)('type').optional().isIn(['Deluxe', 'Suite', 'Executive', 'Presidential']).withMessage('Invalid room type'),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    (0, express_validator_1.body)('status').optional().isIn(['Available', 'Occupied', 'Cleaning']).withMessage('Invalid status'),
    (0, express_validator_1.body)('capacity').optional().isInt({ min: 1, max: 10 }).withMessage('Capacity must be 1-10'),
    (0, express_validator_1.body)('size').optional().notEmpty().withMessage('Room size required'),
    (0, express_validator_1.body)('description').optional().notEmpty().withMessage('Description required'),
    (0, express_validator_1.body)('images').optional().isArray().withMessage('Images must be an array'),
    (0, express_validator_1.body)('amenities').optional().isArray().withMessage('Amenities must be an array'),
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
        const { id } = req.params;
        const updateData = req.body;
        const room = await Room_1.default.findByPk(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found',
            });
        }
        // Check room number uniqueness if being updated
        if (updateData.roomNumber && updateData.roomNumber !== room.roomNumber) {
            const existingRoom = await Room_1.default.findOne({ where: { roomNumber: updateData.roomNumber } });
            if (existingRoom) {
                return res.status(409).json({
                    success: false,
                    message: 'Room number already exists',
                });
            }
        }
        await room.update(updateData);
        res.json({
            success: true,
            message: 'Room updated successfully',
            data: { room },
        });
    }
    catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Delete room (Admin only)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room_1.default.findByPk(id, {
            include: [{ model: Booking_1.default, as: 'bookings' }],
        });
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found',
            });
        }
        // Check if room has active bookings
        const activeBookings = room.bookings?.filter(booking => ['Pending', 'Confirmed'].includes(booking.paymentStatus));
        if (activeBookings && activeBookings.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete room with active bookings',
            });
        }
        await room.destroy();
        res.json({
            success: true,
            message: 'Room deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=rooms.js.map