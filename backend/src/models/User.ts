import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/user.types.js';

export interface IUserModel extends IUser, Document {
    _id: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: Number, unique: true, sparse: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IUserModel>('User', UserSchema);
