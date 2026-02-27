import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constants/HttpStatus.js';

interface DecodedToken {
    id: string;
    [key: string]: any;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token' });
    }
};
