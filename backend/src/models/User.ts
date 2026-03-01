import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.types.js';

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, },
        email: { type: String, unique: true, sparse: true },
        phone: { type: Number, unique: true, sparse: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
