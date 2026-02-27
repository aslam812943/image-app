import { IUser } from '../types/user.types.js';
import User from '../models/User.js';
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

    async updatePassword(identifier: string | number, password: string): Promise<boolean> {
        const query = typeof identifier === 'string' ? { email: identifier } : { phone: identifier };
        const result = await User.updateOne(query, { $set: { password } });
        return result.modifiedCount > 0;
    }

    private mapToIUser(doc: any): IUser {
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
