import { Model } from 'sequelize';
import User from './User';
import Room from './Room';
export interface BookingAttributes {
    id: string;
    userId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    paymentStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded';
    paymentIntentId?: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guests: number;
    specialRequests?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface BookingCreationAttributes extends Omit<BookingAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    id: string;
    userId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    paymentStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded';
    paymentIntentId?: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guests: number;
    specialRequests?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly user?: User;
    readonly room?: Room;
}
export default Booking;
//# sourceMappingURL=Booking.d.ts.map