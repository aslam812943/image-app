import { IImage } from '../../types/image.types.js';

export interface IImageRepository {
    create(imageData: IImage): Promise<IImage>;
    createMany(imagesData: IImage[]): Promise<IImage[]>;
    findById(imageId: string): Promise<IImage | null>;
    findByUserId(userId: string): Promise<IImage[]>;
    update(imageId: string, imageData: Partial<IImage>): Promise<IImage | null>;
    updateOrder(updates: { imageId: string; order: number }[]): Promise<void>;
    deleteById(imageId: string): Promise<boolean>;
}
