import { IImage } from '../types/image.types.js';
import { IImageRepository } from '../repositories/interfaces/IImageRepository.js';
import fs from 'fs';
import path from 'path';
import { IImageService } from './interfaces/IImageService.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { getPublicIdFromUrl } from '../utils/cloudinaryUtils.js';

export class ImageService implements IImageService {
    constructor(private imageRepository: IImageRepository) { }

    async uploadImages(userId: string, imageData: Array<{ title: string; imageUrl: string }>): Promise<IImage[]> {
        const { images: existingImages } = await this.imageRepository.findByUserId(userId, 1, 1000);
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
        if (updates.imageUrl) {
            const currentImage = await this.imageRepository.findById(imageId);
            if (currentImage && currentImage.userId === userId && currentImage.imageUrl) {
                const oldPath = path.join(process.cwd(), currentImage.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }
        return await this.imageRepository.update(imageId, userId, updates);
    }

    async updateImageTitle(imageId: string, userId: string, title: string): Promise<IImage | null> {
        return await this.imageRepository.update(imageId, userId, { title });
    }

    async reorderImages(userId: string, updates: { imageId: string; order: number }[]): Promise<void> {
        await this.imageRepository.updateOrder(userId, updates);
    }
    async getUserImages(userId: string, page?: number, limit?: number): Promise<{ images: IImage[], total: number }> {
        return await this.imageRepository.findByUserId(userId, page, limit);
    }

    async deleteImage(imageId: string, userId: string): Promise<boolean> {
        const image = await this.imageRepository.findById(imageId);
        if (image && image.userId === userId) {
            const publicId = getPublicIdFromUrl(image.imageUrl);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.error(`Failed to delete image from Cloudinary: ${publicId}`, error);
                }
            }
        }
        return await this.imageRepository.deleteById(imageId, userId);
    }

    async deleteAllImages(userId: string): Promise<boolean> {
        const { images } = await this.imageRepository.findByUserId(userId, 1, 10000);
        if (images.length > 0) {
            const publicIds = images
                .map((img) => getPublicIdFromUrl(img.imageUrl))
                .filter((id): id is string => id !== null);

            if (publicIds.length > 0) {
                try {
              
                    for (let i = 0; i < publicIds.length; i += 100) {
                        const chunk = publicIds.slice(i, i + 100);
                        await cloudinary.api.delete_resources(chunk);
                    }
                } catch (error) {
                    console.error('Failed to delete bulk images from Cloudinary', error);
                }
            }
        }
        return await this.imageRepository.deleteAllByUserId(userId);
    }
}
