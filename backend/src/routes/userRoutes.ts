import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { RegisterService } from '../services/RegisterService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { LoginService } from '../services/LoginService.js';
const router = express.Router();

// Dependency Injection Setup
const userRepository = new UserRepository();
const registerService = new RegisterService(userRepository);
const loginService = new LoginService(userRepository)
const userController = new UserController(registerService,loginService);

router.post('/register', userController.register);
router.post('/login',userController.login)
export default router;
