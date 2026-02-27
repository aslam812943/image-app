import { Request, Response } from 'express';
import { IRegisterService } from '../services/interfaces/IRegisterService.js';
import { IUser } from '../types/user.types.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { AUTH_MESSAGES } from '../constants/MessageConstants.js';
import { ILoginService } from '../services/interfaces/ILoginService.js';
export class UserController {
    constructor(private _registerService: IRegisterService, private _loginService: ILoginService) { }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
         
            const userData: IUser = req.body;
            const success = await this._registerService.register(userData);

            if (success) {
                res.status(HttpStatus.CREATED).json({
                    message: AUTH_MESSAGES.REGISTER_SUCCESS,
                });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: AUTH_MESSAGES.REGISTER_FAILED,
                });
            }
        } catch (error: unknown) {
            let errorMessage: string = AUTH_MESSAGES.REGISTER_FAILED;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            res.status(HttpStatus.BAD_REQUEST).json({
                message: errorMessage,
            });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { identifier, password } = req.body;
            const { user, token } = await this._loginService.login(identifier, password);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.status(HttpStatus.OK).json({
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                user,
            });
        } catch (error: unknown) {
            let errorMessage: string = AUTH_MESSAGES.LOGIN_FAILED;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: errorMessage,
            });
        }
    }

    logout = async (_req: Request, res: Response): Promise<void> => {
        res.clearCookie('token');
        res.status(HttpStatus.OK).json({
            message: 'Logged out successfully',
        });
    }

    getMe = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = (req as any).user;
            res.status(HttpStatus.OK).json({ user });
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
    }
}
