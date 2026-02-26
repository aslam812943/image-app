import bcrypt from 'bcrypt';
import { IUser } from '../types/user.types.js';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { AUTH_MESSAGES } from '../constants/MessageConstants.js';

export class AuthService {
    constructor(private userRepository: IUserRepository) { }

    async register(userData: IUser): Promise<IUser> {
        // Validation: Must have either email or phone
        if (!userData.email && !userData.phone) {
            throw new Error(AUTH_MESSAGES.EMAIL_OR_PHONE_REQUIRED);
        }

        // Check if user exists by email if provided
        if (userData.email) {
            const existingEmail = await this.userRepository.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error(AUTH_MESSAGES.EMAIL_EXISTS);
            }
        }

        // Check if user exists by phone if provided
        if (userData.phone) {
            const existingPhone = await this.userRepository.findByPhone(userData.phone);
            if (existingPhone) {
                throw new Error(AUTH_MESSAGES.PHONE_EXISTS);
            }
        }

        // Check if user exists by username
        const existingUsername = await this.userRepository.findByUsername(userData.username);
        if (existingUsername) {
            throw new Error(AUTH_MESSAGES.USERNAME_TAKEN);
        }

        // Hash password
        if (!userData.password) {
            throw new Error(AUTH_MESSAGES.PASSWORD_REQUIRED);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create user
        const userToCreate: IUser = {
            ...userData,
            password: hashedPassword,
        };

        const createdUser = await this.userRepository.create(userToCreate);

        // Remove password before returning
        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
    }
}
