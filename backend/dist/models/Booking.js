"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Room_1 = __importDefault(require("./Room"));
class Booking extends sequelize_1.Model {
}
Booking.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_1.default,
            key: 'id',
        },
    },
    roomId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Room_1.default,
            key: 'id',
        },
    },
    checkInDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString().split('T')[0], // Cannot book past dates
        },
    },
    checkOutDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfterCheckIn(value) {
                if (value <= this.checkInDate) {
                    throw new Error('Check-out date must be after check-in date');
                }
            },
        },
    },
    totalPrice: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Refunded'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    paymentIntentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    guestName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100],
        },
    },
    guestEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    guestPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    guests: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10,
        },
    },
    specialRequests: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Booking',
    tableName: 'bookings',
    indexes: [
        {
            fields: ['userId'],
        },
        {
            fields: ['roomId'],
        },
        {
            fields: ['checkInDate', 'checkOutDate'],
        },
        {
            fields: ['paymentStatus'],
        },
        {
            unique: true,
            fields: ['paymentIntentId'],
        },
    ],
});
exports.default = Booking;
//# sourceMappingURL=Booking.js.map