import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constants/HttpStatus.js';
import { COMMON_MESSAGES } from '../constants/MessageConstants.js';
import { IUser } from '../types/user.types.js';

interface DecodedToken {
    id?: string;
    userId?: string;
    email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: COMMON_MESSAGES.UNAUTHORIZED_NO_TOKEN });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken
        const normalizedUserId = decoded.userId || decoded.id;
        req.user = { username: '', ...decoded, userId: normalizedUserId } as Partial<IUser>;
        next();
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: COMMON_MESSAGES.UNAUTHORIZED_INVALID_TOKEN });
    }
};
