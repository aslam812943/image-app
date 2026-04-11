import express from 'express';
import multer from 'multer';
import { ImageController } from '../controllers/ImageController.js';
import { ImageService } from '../services/ImageService.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { CloudinaryUploadService } from '../services/CloudinaryUploadService.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

const imageRepository = new ImageRepository();
const uploadService = new CloudinaryUploadService();
const imageService = new ImageService(imageRepository, uploadService);
const imageController = new ImageController(imageService);

router.post('/upload', authMiddleware, upload.array('images'), imageController.upload);
router.get('/', authMiddleware, imageController.getImages);
router.patch('/:imageId', authMiddleware, upload.single('image'), imageController.update);
router.put('/reorder', authMiddleware, imageController.reorder);
router.delete('/all', authMiddleware, imageController.deleteAllImages);
router.delete('/:imageId', authMiddleware, imageController.deleteImage);

export default router;
