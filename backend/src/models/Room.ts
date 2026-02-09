import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IRoom extends Model {
  id: number;
  roomNumber: string;
  type: 'Deluxe' | 'Suite' | 'Executive' | 'Presidential';
  price: number;
  status: 'Available' | 'Occupied' | 'Cleaning';
  images: string[];
  amenities: string[];
  description: string;
  capacity: number;
  size: string;
  createdAt: Date;
  updatedAt: Date;
}

const Room = sequelize.define<IRoom>('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  type: {
    type: DataTypes.ENUM('Deluxe', 'Suite', 'Executive', 'Presidential'),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('Available', 'Occupied', 'Cleaning'),
    defaultValue: 'Available',
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['type'] },
  ],
});

export { Room };
