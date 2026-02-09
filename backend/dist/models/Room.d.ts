import { Model } from 'sequelize';
export interface RoomAttributes {
    id: string;
    roomNumber: string;
    type: 'Deluxe' | 'Suite' | 'Executive' | 'Presidential';
    price: number;
    status: 'Available' | 'Occupied' | 'Cleaning';
    images: string[];
    amenities: string[];
    description: string;
    capacity: number;
    size: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface RoomCreationAttributes extends Omit<RoomAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    id: string;
    roomNumber: string;
    type: 'Deluxe' | 'Suite' | 'Executive' | 'Presidential';
    price: number;
    status: 'Available' | 'Occupied' | 'Cleaning';
    images: string[];
    amenities: string[];
    description: string;
    capacity: number;
    size: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map