import { IImage } from '../../types/image.types.js';

export interface IImageService {
    uploadImages(userId: string, imageData: Array<{ title: string; imageUrl: string }>): Promise<IImage[]>;
    updateImage(id: string, updates: { title?: string, imageUrl?: string }): Promise<IImage | null>;
    updateImageTitle(id: string, title: string): Promise<IImage | null>;
    reorderImages(updates: { id: string; order: number }[]): Promise<void>;
    getUserImages(userId: string): Promise<IImage[]>;
    deleteImage(id: string): Promise<boolean>;
}
