import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constants/HttpStatus.js';
import { COMMON_MESSAGES } from '../constants/MessageConstants.js';

interface DecodedToken {
    id: string;
    email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: COMMON_MESSAGES.UNAUTHORIZED_NO_TOKEN });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: COMMON_MESSAGES.UNAUTHORIZED_INVALID_TOKEN });
    }
};
