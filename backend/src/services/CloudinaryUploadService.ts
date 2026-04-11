import { IUploadService } from './interfaces/IUploadService.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export class CloudinaryUploadService implements IUploadService {
    async upload(file: Express.Multer.File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'image-app', timeout: 120000 },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) return reject(error);
                    resolve(result!.secure_url);
                }
            );
            uploadStream.end(file.buffer);
        });
    }

    async delete(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
          
            return false;
        }
    }

    async deleteMany(publicIds: string[]): Promise<boolean> {
        try {
           
            for (let i = 0; i < publicIds.length; i += 100) {
                const chunk = publicIds.slice(i, i + 100);
                await cloudinary.api.delete_resources(chunk);
            }
            return true;
        } catch (error) {
            console.error('Cloudinary bulk delete failed', error);
            return false;
        }
    }
}
