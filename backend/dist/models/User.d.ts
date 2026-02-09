import { Model } from 'sequelize';
export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    phone?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    phone?: string;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export default User;
//# sourceMappingURL=User.d.ts.map