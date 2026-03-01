import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { IMAGE_MESSAGES } from '../constants/MessageConstants.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export class ImageController {
    constructor(private _imageService: ImageService) { }

    upload = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id!;

            const files = req.files as Express.Multer.File[];
            const titles = req.body.titles ? JSON.parse(req.body.titles) : [];

            if (!files || files.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: IMAGE_MESSAGES.NO_FILES });
            }

            const uploadPromises = files.map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'image-app' },
                        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                            if (error) return reject(error);
                            resolve(result!.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            const imageData = uploadedUrls.map((url, index) => ({
                title: titles[index] || 'Untitled',
                imageUrl: url,
            }));

            const images = await this._imageService.uploadImages(userId, imageData);
            res.status(HttpStatus.CREATED).json(images);
        } catch (error) {
            console.error('Cloudinary upload error full detail:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: IMAGE_MESSAGES.UPLOAD_FAILED,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    getImages = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id!;
            const images = await this._imageService.getUserImages(userId);
            res.status(HttpStatus.OK).json(images);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.FETCH_FAILED });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const file = req.file as Express.Multer.File;

            interface ImageUpdates {
                title?: string;
                imageUrl?: string;
            }

            const updates: ImageUpdates = {};
            if (title) updates.title = title;

            if (file) {
                const result = await new Promise<string>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'image-app' },
                        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                            if (error) return reject(error);
                            resolve(result!.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
                updates.imageUrl = result;
            }

            if (!id || (Object.keys(updates).length === 0)) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: IMAGE_MESSAGES.UPDATE_DATA_REQUIRED });
            }

            const updatedImage = await this._imageService.updateImage(id as string, updates);
            if (updatedImage) {
                res.status(HttpStatus.OK).json(updatedImage);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: IMAGE_MESSAGES.NOT_FOUND });
            }
        } catch (error) {
            console.error('Cloudinary update error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.UPDATE_FAILED });
        }
    };

    reorder = async (req: Request, res: Response) => {
        try {
            const { updates } = req.body;
            await this._imageService.reorderImages(updates);
            res.status(HttpStatus.OK).json({ message: IMAGE_MESSAGES.REORDER_SUCCESS });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.REORDER_FAILED });
        }
    };

    deleteImage = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: IMAGE_MESSAGES.INVALID_ID });
            }
            const success = await this._imageService.deleteImage(id);
            if (success) {
                res.status(HttpStatus.OK).json({ message: IMAGE_MESSAGES.DELETE_SUCCESS });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: IMAGE_MESSAGES.NOT_FOUND });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.DELETE_FAILED });
        }
    };
}
