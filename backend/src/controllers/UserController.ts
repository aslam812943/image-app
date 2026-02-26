import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { IUser } from '../types/user.types.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { AUTH_MESSAGES } from '../constants/MessageConstants.js';

export class UserController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('datavann')
            const userData: IUser = req.body;
            const user = await this.authService.register(userData);
            res.status(HttpStatus.CREATED).json({
                message: AUTH_MESSAGES.REGISTER_SUCCESS,
                user,
            });
        } catch (error: unknown) {
            let errorMessage = AUTH_MESSAGES.REGISTER_FAILED;
        
            res.status(HttpStatus.BAD_REQUEST).json({
                message: errorMessage,
            });
        }
    };
}
