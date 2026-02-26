import express from 'express';
import multer from 'multer';
import path from 'path';
import { ImageController } from '../controllers/ImageController.js';
import { ImageService } from '../services/ImageService.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const imageRepository = new ImageRepository();
const imageService = new ImageService(imageRepository);
const imageController = new ImageController(imageService);

router.post('/upload', authMiddleware, upload.array('images'), imageController.upload);
router.get('/', authMiddleware, imageController.getImages);
router.patch('/:id', authMiddleware, upload.single('image'), imageController.update);
router.put('/reorder', authMiddleware, imageController.reorder);
router.delete('/:id', authMiddleware, imageController.deleteImage);

export default router;
