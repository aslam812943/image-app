import mongoose, { Schema } from 'mongoose';
import { IImage } from '../types/image.types.js';

const imageSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IImage>('Image', imageSchema);
