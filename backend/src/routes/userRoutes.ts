import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { AuthService } from '../services/AuthService.js';
import { UserRepository } from '../repositories/UserRepository.js';

const router = express.Router();

// Dependency Injection Setup
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const userController = new UserController(authService);

router.post('/register', userController.register);

export default router;
