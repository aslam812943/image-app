import { Request, Response } from 'express';
import { IRegisterService } from '../services/interfaces/IRegisterService.js';
import { IUser } from '../types/user.types.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { AUTH_MESSAGES, COMMON_MESSAGES } from '../constants/MessageConstants.js';
import { ILoginService } from '../services/interfaces/ILoginService.js';
import { IPasswordResetService } from '../services/interfaces/IPasswordResetService.js';

export class UserController {
    constructor(
        private _registerService: IRegisterService,
        private _loginService: ILoginService,
        private _passwordResetService: IPasswordResetService
    ) { }

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
                secure: true,
                sameSite: 'none',
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
            message: COMMON_MESSAGES.LOGOUT_SUCCESS,
        });
    }

    getMe = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user;
            res.status(HttpStatus.OK).json({ user });
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: COMMON_MESSAGES.UNAUTHORIZED });
        }
    }

    verifyIdentity = async (req: Request, res: Response): Promise<void> => {
        try {
            const { identifier } = req.body;
            const success = await this._passwordResetService.verifyIdentity(identifier);
            if (success) {
                res.status(HttpStatus.OK).json({ message: COMMON_MESSAGES.EMAIL_VERIFIED });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: AUTH_MESSAGES.EMAIL_NOT_FOUND });
            }
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: COMMON_MESSAGES.VERIFICATION_FAILED });
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { identifier, password } = req.body;
            const success = await this._passwordResetService.resetPassword(identifier, password);

            if (success) {
                res.status(HttpStatus.OK).json({ message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: AUTH_MESSAGES.PASSWORD_RESET_FAILED });
            }
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: AUTH_MESSAGES.PASSWORD_RESET_FAILED });
        }
    }
}
