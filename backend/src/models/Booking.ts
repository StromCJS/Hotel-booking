import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded';
  paymentIntentId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v: Date) {
          return v >= new Date(new Date().toDateString());
        },
        message: 'Check-in date cannot be in the past',
      },
    },
    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IBooking, v: Date) {
          return v > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    paymentIntentId: {
      type: String,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    guestPhone: {
      type: String,
      required: true,
      trim: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ roomId: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
