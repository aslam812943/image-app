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

    async updateImage(id: string, updates: { title?: string, imageUrl?: string }): Promise<IImage | null> {

        if (updates.imageUrl) {
            const currentImage = await this.imageRepository.findById(id);
            if (currentImage && currentImage.imageUrl) {
                const oldPath = path.join(process.cwd(), currentImage.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }
        return await this.imageRepository.update(id, updates);
    }

    async updateImageTitle(id: string, title: string): Promise<IImage | null> {
        return await this.imageRepository.update(id, { title });
    }

    async reorderImages(updates: { id: string; order: number }[]): Promise<void> {
        await this.imageRepository.updateOrder(updates);
    }

    async getUserImages(userId: string): Promise<IImage[]> {
        return await this.imageRepository.findByUserId(userId);
    }

    async deleteImage(id: string): Promise<boolean> {
        return await this.imageRepository.deleteById(id);
    }
}
