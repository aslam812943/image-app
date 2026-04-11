import { IImage } from '../../types/image.types.js';

export interface IImageRepository {
    create(imageData: IImage): Promise<IImage>;
    createMany(imagesData: IImage[]): Promise<IImage[]>;
    findById(imageId: string): Promise<IImage | null>;
    findByUserId(userId: string, page?: number, limit?: number): Promise<{ images: IImage[], total: number }>;
    update(imageId: string, userId: string, imageData: Partial<IImage>): Promise<IImage | null>;
    updateOrder(userId: string, updates: { imageId: string; order: number }[]): Promise<void>;
    deleteById(imageId: string, userId: string): Promise<boolean>;
}
