import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService.js';
import { HttpStatus } from '../constants/HttpStatus.js';

export class ImageController {
    constructor(private _imageService: ImageService) { }

    upload = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;

            const files = req.files as Express.Multer.File[];
            const titles = JSON.parse(req.body.titles);

            if (!files || files.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No files uploaded' });
            }

            const imageData = files.map((file, index) => ({
                title: titles[index] || 'Untitled',
                imageUrl: `/uploads/${file.filename}`,
            }));

            const images = await this._imageService.uploadImages(userId, imageData);
            res.status(HttpStatus.CREATED).json(images);
        } catch (error) {
         
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to upload images' });
        }
    };

    getImages = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const images = await this._imageService.getUserImages(userId);
            res.status(HttpStatus.OK).json(images);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch images' });
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
            if (file) updates.imageUrl = `/uploads/${file.filename}`;

            if (!id || (Object.keys(updates).length === 0)) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Update data required' });
            }

            const updatedImage = await this._imageService.updateImage(id as string, updates);
            if (updatedImage) {
                res.status(HttpStatus.OK).json(updatedImage);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Image not found' });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update image' });
        }
    };

    reorder = async (req: Request, res: Response) => {
        try {
            const { updates } = req.body;
            await this._imageService.reorderImages(updates);
            res.status(HttpStatus.OK).json({ message: 'Images reordered' });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to reorder images' });
        }
    };

    deleteImage = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid image ID' });
            }
            const success = await this._imageService.deleteImage(id);
            if (success) {
                res.status(HttpStatus.OK).json({ message: 'Image deleted' });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Image not found' });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete image' });
        }
    };
}
