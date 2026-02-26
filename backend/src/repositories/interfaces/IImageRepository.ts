import { IImage } from '../../types/image.types.js';

export interface IImageRepository {
    create(imageData: IImage): Promise<IImage>;
    createMany(imagesData: IImage[]): Promise<IImage[]>;
    findById(id: string): Promise<IImage | null>;
    findByUserId(userId: string): Promise<IImage[]>;
    update(id: string, imageData: Partial<IImage>): Promise<IImage | null>;
    updateOrder(updates: { id: string; order: number }[]): Promise<void>;
    deleteById(id: string): Promise<boolean>;
}
