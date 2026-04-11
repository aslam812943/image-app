import { IImage } from '../../types/image.types.js';

export interface IImageService {
    uploadImages(userId: string, files: Express.Multer.File[], titles: string[]): Promise<IImage[]>;
    updateImage(imageId: string, userId: string, updates: { title?: string }, file?: Express.Multer.File): Promise<IImage | null>;
    updateImageTitle(imageId: string, userId: string, title: string): Promise<IImage | null>;
    reorderImages(userId: string, updates: { imageId: string; order: number }[]): Promise<void>;
    getUserImages(userId: string, page?: number, limit?: number): Promise<{ images: IImage[], total: number }>;
    deleteImage(imageId: string, userId: string): Promise<boolean>;
    deleteAllImages(userId: string): Promise<boolean>;
}
