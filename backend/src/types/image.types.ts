export interface IImage {
    id?: string;
    userId: string;
    title: string;
    imageUrl: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}
