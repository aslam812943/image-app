export interface IUploadService {
    upload(file: Express.Multer.File): Promise<string>;
    delete(publicId: string): Promise<boolean>;
    deleteMany(publicIds: string[]): Promise<boolean>;
}
