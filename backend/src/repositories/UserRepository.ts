import { IUser } from '../types/user.types.js';
import User, { IUserModel } from '../models/User.js';
import { IUserRepository } from './interfaces/IUserRepository.js';

export class UserRepository implements IUserRepository {
    async create(userData: IUser): Promise<IUser> {
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        return this.mapToIUser(savedUser);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await User.findOne({ email });
        return user ? this.mapToIUser(user) : null;
    }

    async findByPhone(phone: number): Promise<IUser | null> {
        const user = await User.findOne({ phone });
        return user ? this.mapToIUser(user) : null;
    }

    async findByUsername(username: string): Promise<IUser | null> {
        const user = await User.findOne({ username });
        return user ? this.mapToIUser(user) : null;
    }

    private mapToIUser(doc: IUserModel): IUser {
        const user: IUser = {
            id: doc._id.toString(),
            username: doc.username,
        };

        if (doc.email !== undefined) user.email = doc.email;
        if (doc.phone !== undefined) user.phone = doc.phone;
        if (doc.password !== undefined) user.password = doc.password;
        if (doc.createdAt !== undefined) user.createdAt = doc.createdAt;
        if (doc.updatedAt !== undefined) user.updatedAt = doc.updatedAt;

        return user;
    }
}
