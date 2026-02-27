import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { RegisterService } from '../services/RegisterService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { LoginService } from '../services/LoginService.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { PasswordResetService } from '../services/PasswordResetService.js';
const router = express.Router();


const userRepository = new UserRepository();
const registerService = new RegisterService(userRepository);
const loginService = new LoginService(userRepository);
const passwordResetService = new PasswordResetService(userRepository);
const userController = new UserController(registerService, loginService, passwordResetService);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/me', authMiddleware, userController.getMe);
router.post('/verify-email', userController.verifyIdentity);
router.post('/reset-password', userController.resetPassword);
export default router;
