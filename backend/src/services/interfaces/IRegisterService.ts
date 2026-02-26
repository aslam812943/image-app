import { IUser } from '../../types/user.types.js';

export interface IRegisterService {
    register(userData: IUser): Promise<boolean>;
}
