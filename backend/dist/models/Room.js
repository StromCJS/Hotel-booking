"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Room extends sequelize_1.Model {
}
Room.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    roomNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('Deluxe', 'Suite', 'Executive', 'Presidential'),
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('Available', 'Occupied', 'Cleaning'),
        allowNull: false,
        defaultValue: 'Available',
    },
    images: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        validate: {
            isArray(value) {
                return Array.isArray(value) || { msg: 'Must be an array', args: false };
            },
        },
    },
    amenities: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    capacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10,
        },
    },
    size: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    sequelize: database_1.default,
    modelName: 'Room',
    tableName: 'rooms',
    indexes: [
        {
            fields: ['status'],
        },
        {
            fields: ['type'],
        },
        {
            unique: true,
            fields: ['roomNumber'],
        },
    ],
});
exports.default = Room;
//# sourceMappingURL=Room.js.map