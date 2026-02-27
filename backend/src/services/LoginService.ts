import bcrypt from 'bcrypt'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'
import { AUTH_MESSAGES } from '../constants/MessageConstants.js'
import { IUser } from '../types/user.types.js'
import { ILoginService } from './interfaces/ILoginService.js'
import jwt from 'jsonwebtoken'

export class LoginService implements ILoginService {
    constructor(private _userRepository: IUserRepository) { }

    async login(identifier: string, password: string): Promise<{ user: IUser; token: string }> {
        let user: IUser | null = null;


        if (identifier.includes('@')) {
            user = await this._userRepository.findByEmail(identifier);
        } else if (!isNaN(Number(identifier))) {

            user = await this._userRepository.findByPhone(Number(identifier));
        }

        if (!user || !user.password) {
            throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error(AUTH_MESSAGES.INVALID_PASSWORD);
        }


        const { password: _, ...userWithoutPassword } = user;

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return { user: userWithoutPassword as IUser, token };
    }
}