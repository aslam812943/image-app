import bcrypt from 'bcrypt';
import { IUser } from '../types/user.types.js';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { AUTH_MESSAGES } from '../constants/MessageConstants.js';
import { IRegisterService } from './interfaces/IRegisterService.js';

export class RegisterService implements IRegisterService {
    constructor(private _userRepository: IUserRepository) { }

    async register(userData: IUser): Promise<boolean> {
        if (!userData.email && !userData.phone) {
            throw new Error(AUTH_MESSAGES.EMAIL_OR_PHONE_REQUIRED);
        }
        if (userData.email) {
            const existingEmail = await this._userRepository.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error(AUTH_MESSAGES.EMAIL_EXISTS);
            }
        }

        if (userData.phone) {
            const existingPhone = await this._userRepository.findByPhone(userData.phone);
            if (existingPhone) {
                throw new Error(AUTH_MESSAGES.PHONE_EXISTS);
            }
        }

   
        if (!userData.password) {
            throw new Error(AUTH_MESSAGES.PASSWORD_REQUIRED);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const userToCreate: IUser = {
            ...userData,
            password: hashedPassword,
        };

        await this._userRepository.create(userToCreate);

       
       
        return true
    }
}
