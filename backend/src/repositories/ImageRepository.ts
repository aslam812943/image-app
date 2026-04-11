import { IImage } from '../types/image.types.js';
import Image from '../models/Image.js';
import { IImageRepository } from './interfaces/IImageRepository.js';

interface ImageDocument {
    _id: { toString(): string };
    userId: { toString(): string };
    title: string;
    imageUrl: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ImageRepository implements IImageRepository {
    async create(imageData: IImage): Promise<IImage> {
        const newImage = new Image(imageData);
        const savedImage = await newImage.save();
        return this.mapToIImage(savedImage);
    }

    async createMany(imagesData: IImage[]): Promise<IImage[]> {
        const savedImages = await Image.insertMany(imagesData);
        return savedImages.map((img) => this.mapToIImage(img));
    }

    async findById(imageId: string): Promise<IImage | null> {
        const image = await Image.findById(imageId);
        return image ? this.mapToIImage(image) : null;
    }

    async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ images: IImage[], total: number }> {
        const skip = (page - 1) * limit;
        const [images, total] = await Promise.all([
            Image.find({ userId }).sort({ order: 1 }).skip(skip).limit(limit),
            Image.countDocuments({ userId })
        ]);
        return {
            images: images.map((img) => this.mapToIImage(img)),
            total
        };
    }

    async update(imageId: string, userId: string, imageData: Partial<IImage>): Promise<IImage | null> {
        const updatedImage = await Image.findOneAndUpdate({ _id: imageId, userId }, imageData, { returnDocument: 'after' });
        return updatedImage ? this.mapToIImage(updatedImage) : null;
    }

    async updateOrder(userId: string, updates: { imageId: string; order: number }[]): Promise<void> {
        const bulkOps = updates.map((update) => ({
            updateOne: {
                filter: { _id: update.imageId, userId },
                update: { $set: { order: update.order } },
            },
        }));
        await Image.bulkWrite(bulkOps);
    }

    async deleteById(imageId: string, userId: string): Promise<boolean> {
        const result = await Image.findOneAndDelete({ _id: imageId, userId });
        return result !== null;
    }

    async deleteAllByUserId(userId: string): Promise<boolean> {
        const result = await Image.deleteMany({ userId });
        return result.deletedCount > 0;
    }

    private mapToIImage(doc: ImageDocument): IImage {
        const image: IImage = {
            imageId: doc._id.toString(),
            userId: doc.userId.toString(),
            title: doc.title,
            imageUrl: doc.imageUrl,
            order: doc.order,
        };

        if (doc.createdAt !== undefined) image.createdAt = doc.createdAt;
        if (doc.updatedAt !== undefined) image.updatedAt = doc.updatedAt;

        return image;
    }
}
