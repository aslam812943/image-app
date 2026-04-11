import { Request, Response } from 'express';
import { IImageService } from '../services/interfaces/IImageService.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { IMAGE_MESSAGES } from '../constants/MessageConstants.js';

export class ImageController {
    constructor(private _imageService: IImageService) { }

    upload = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: please log in again.' });
            }
            const files = req.files as Express.Multer.File[];
            const titles = req.body.titles ? JSON.parse(req.body.titles) : [];

            if (!files || files.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: IMAGE_MESSAGES.NO_FILES });
            }

            const images = await this._imageService.uploadImages(userId, files, titles);
            res.status(HttpStatus.CREATED).json(images);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: IMAGE_MESSAGES.UPLOAD_FAILED,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    getImages = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId!;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this._imageService.getUserImages(userId, page, limit);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.FETCH_FAILED });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { imageId } = req.params;
            const { title } = req.body;
            const file = req.file as Express.Multer.File;

            const updates = { title };
            const userId = req.user!.userId!;

            const updatedImage = await this._imageService.updateImage(imageId as string, userId, updates, file);
            if (updatedImage) {
                res.status(HttpStatus.OK).json(updatedImage);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: IMAGE_MESSAGES.NOT_FOUND });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.UPDATE_FAILED });
        }
    };

    reorder = async (req: Request, res: Response) => {
        try {
            const { updates } = req.body;
            const userId = req.user!.userId!;
            await this._imageService.reorderImages(userId, updates);
            res.status(HttpStatus.OK).json({ message: IMAGE_MESSAGES.REORDER_SUCCESS });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.REORDER_FAILED });
        }
    };

    deleteImage = async (req: Request, res: Response) => {
        try {
            const { imageId } = req.params;
            if (!imageId || typeof imageId !== 'string') {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: IMAGE_MESSAGES.INVALID_ID });
            }
            const userId = req.user!.userId!;
            const success = await this._imageService.deleteImage(imageId, userId);
            if (success) {
                res.status(HttpStatus.OK).json({ message: IMAGE_MESSAGES.DELETE_SUCCESS });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: IMAGE_MESSAGES.NOT_FOUND });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.DELETE_FAILED });
        }
    };

    deleteAllImages = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId!;
            const success = await this._imageService.deleteAllImages(userId);
            if (success) {
                res.status(HttpStatus.OK).json({ message: IMAGE_MESSAGES.DELETE_ALL_SUCCESS });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: IMAGE_MESSAGES.NOT_FOUND });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: IMAGE_MESSAGES.DELETE_ALL_FAILED });
        }
    };
}
