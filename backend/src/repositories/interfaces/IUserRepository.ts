import { IUser } from '../../types/user.types.js';

export interface IUserRepository {
    create(user: IUser): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findByPhone(phone: number): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    updatePassword(identifier: string | number, password: string): Promise<boolean>;
}
