import { IImage } from '../types/image.types.js';
import { IImageRepository } from '../repositories/interfaces/IImageRepository.js';
import fs from 'fs';
import path from 'path';
import { IImageService } from './interfaces/IImageService.js';

export class ImageService implements IImageService {
    constructor(private imageRepository: IImageRepository) { }

    async uploadImages(userId: string, imageData: Array<{ title: string; imageUrl: string }>): Promise<IImage[]> {
        const existingImages = await this.imageRepository.findByUserId(userId);
        let maxOrder = existingImages.length > 0 ? Math.max(...existingImages.map((img) => img.order)) : -1;

        const imagesToCreate: IImage[] = imageData.map((data) => ({
            userId,
            title: data.title,
            imageUrl: data.imageUrl,
            order: ++maxOrder,
        }));

        return await this.imageRepository.createMany(imagesToCreate);
    }

    async updateImage(imageId: string, userId: string, updates: { title?: string, imageUrl?: string }): Promise<IImage | null> {
        const currentImage = await this.imageRepository.findById(imageId);
        if (!currentImage || currentImage.userId !== userId) {
            return null;
        }

        if (updates.imageUrl && currentImage.imageUrl) {
            const oldPath = path.join(process.cwd(), currentImage.imageUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        return await this.imageRepository.update(imageId, updates);
    }

    async updateImageTitle(imageId: string, userId: string, title: string): Promise<IImage | null> {
        const currentImage = await this.imageRepository.findById(imageId);
        if (!currentImage || currentImage.userId !== userId) {
            return null;
        }
        return await this.imageRepository.update(imageId, { title });
    }

    async reorderImages(userId: string, updates: { imageId: string; order: number }[]): Promise<void> {
        const userImages = await this.imageRepository.findByUserId(userId);
        const userImageIds = new Set(userImages.map((img) => img.id));

        const authorizedUpdates = updates.filter((update) => userImageIds.has(update.imageId));

        if (authorizedUpdates.length > 0) {
            await this.imageRepository.updateOrder(authorizedUpdates);
        }
    }

    async getUserImages(userId: string): Promise<IImage[]> {
        return await this.imageRepository.findByUserId(userId);
    }

    async deleteImage(imageId: string, userId: string): Promise<boolean> {
        const currentImage = await this.imageRepository.findById(imageId);
        if (!currentImage || currentImage.userId !== userId) {
            return false;
        }
        return await this.imageRepository.deleteById(imageId);
    }
}
