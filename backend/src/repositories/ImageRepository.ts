import { IImage } from '../types/image.types.js';
import Image from '../models/Image.js';
import { IImageRepository } from './interfaces/IImageRepository.js';

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

    async findById(id: string): Promise<IImage | null> {
        const image = await Image.findById(id);
        return image ? this.mapToIImage(image) : null;
    }

    async findByUserId(userId: string): Promise<IImage[]> {
        const images = await Image.find({ userId }).sort({ order: 1 });
        return images.map((img) => this.mapToIImage(img));
    }

    async update(id: string, imageData: Partial<IImage>): Promise<IImage | null> {
        const updatedImage = await Image.findByIdAndUpdate(id, imageData, { new: true });
        return updatedImage ? this.mapToIImage(updatedImage) : null;
    }

    async updateOrder(updates: { id: string; order: number }[]): Promise<void> {
        const bulkOps = updates.map((update) => ({
            updateOne: {
                filter: { _id: update.id },
                update: { $set: { order: update.order } },
            },
        }));
        await Image.bulkWrite(bulkOps);
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await Image.findByIdAndDelete(id);
        return result !== null;
    }

    private mapToIImage(doc: any): IImage {
        const image: IImage = {
            id: doc._id.toString(),
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
