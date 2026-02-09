import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export interface AuthRequest extends Request {
    user: User;
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireCustomer: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map