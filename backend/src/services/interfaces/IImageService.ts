import { IImage } from '../../types/image.types.js';

export interface IImageService {
    uploadImages(userId: string, imageData: Array<{ title: string; imageUrl: string }>): Promise<IImage[]>;
    updateImage(imageId: string, updates: { title?: string, imageUrl?: string }): Promise<IImage | null>;
    updateImageTitle(imageId: string, title: string): Promise<IImage | null>;
    reorderImages(updates: { imageId: string; order: number }[]): Promise<void>;
    getUserImages(userId: string): Promise<IImage[]>;
    deleteImage(imageId: string): Promise<boolean>;
}
