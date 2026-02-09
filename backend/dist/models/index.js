"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.sequelize = exports.Booking = exports.Room = exports.User = void 0;
// Export all models
var User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(User_1).default; } });
var Room_1 = require("./Room");
Object.defineProperty(exports, "Room", { enumerable: true, get: function () { return __importDefault(Room_1).default; } });
var Booking_1 = require("./Booking");
Object.defineProperty(exports, "Booking", { enumerable: true, get: function () { return __importDefault(Booking_1).default; } });
// Export database connection
var database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return __importDefault(database_1).default; } });
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return database_1.initializeDatabase; } });
//# sourceMappingURL=index.js.map