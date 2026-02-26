import { IUser } from '../../types/user.types.js';

export interface ILoginService {
    login(identifier: string, password: string): Promise<{ user: IUser; token: string }>;
}
