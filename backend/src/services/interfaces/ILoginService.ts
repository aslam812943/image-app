import { IUser } from '../../types/user.types.js';

export interface ILoginService {
    login(emailOrUsername: string, password: string): Promise<{ user: IUser; token: string }>;
}
