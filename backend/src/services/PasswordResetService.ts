import bcrypt from 'bcrypt';
import { IPasswordResetService } from './interfaces/IPasswordResetService.js';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

export class PasswordResetService implements IPasswordResetService {
    constructor(private _userRepository: IUserRepository) { }

    async verifyIdentity(emailOrPhone: string | number): Promise<boolean> {
        const user = typeof emailOrPhone === 'string'
            ? await this._userRepository.findByEmail(emailOrPhone)
            : await this._userRepository.findByPhone(emailOrPhone);
        return !!user;
    }

    async resetPassword(emailOrPhone: string | number, password: string): Promise<boolean> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return await this._userRepository.updatePassword(emailOrPhone, hashedPassword);
    }
}
