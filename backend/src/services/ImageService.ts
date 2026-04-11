import { IImage } from '../types/image.types.js';
import { IImageRepository } from '../repositories/interfaces/IImageRepository.js';
import { IImageService } from './interfaces/IImageService.js';
import { IUploadService } from './interfaces/IUploadService.js';
import { getPublicIdFromUrl } from '../utils/cloudinaryUtils.js';

export class ImageService implements IImageService {
    constructor(
        private imageRepository: IImageRepository,
        private uploadService: IUploadService
    ) { }

    async uploadImages(userId: string, files: Express.Multer.File[], titles: string[]): Promise<IImage[]> {
        const { images: existingImages } = await this.imageRepository.findByUserId(userId, 1, 1000);
        let maxOrder = existingImages.length > 0 ? Math.max(...existingImages.map((img) => img.order)) : -1;

        const uploadPromises = files.map(file => this.uploadService.upload(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        const imagesToCreate: IImage[] = uploadedUrls.map((url, index) => ({
            userId,
            title: titles[index] || 'Untitled',
            imageUrl: url,
            order: ++maxOrder,
        }));

        return await this.imageRepository.createMany(imagesToCreate);
    }

    async updateImage(imageId: string, userId: string, updates: { title?: string }, file?: Express.Multer.File): Promise<IImage | null> {
        const imageUpdates: any = { ...updates };
        if (file) {
            const currentImage = await this.imageRepository.findById(imageId);
            if (currentImage && currentImage.userId === userId && currentImage.imageUrl) {
                const oldPublicId = getPublicIdFromUrl(currentImage.imageUrl);
                if (oldPublicId) {
                    await this.uploadService.delete(oldPublicId);
                }
            }
            imageUpdates.imageUrl = await this.uploadService.upload(file);
        }
        return await this.imageRepository.update(imageId, userId, imageUpdates);
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
                await this.uploadService.delete(publicId);
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
                await this.uploadService.deleteMany(publicIds);
            }
        }
        return await this.imageRepository.deleteAllByUserId(userId);
    }
}
