import bcrypt from 'bcrypt';
import { IPasswordResetService } from './interfaces/IPasswordResetService.js';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

export class PasswordResetService implements IPasswordResetService {
    constructor(private _userRepository: IUserRepository) { }

    async verifyIdentity(identifier: string | number): Promise<boolean> {
        const user = typeof identifier === 'string'
            ? await this._userRepository.findByEmail(identifier)
            : await this._userRepository.findByPhone(identifier);
        return !!user;
    }

    async resetPassword(identifier: string | number, password: string): Promise<boolean> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return await this._userRepository.updatePassword(identifier, hashedPassword);
    }
}
