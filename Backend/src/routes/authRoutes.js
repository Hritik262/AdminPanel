import express from 'express';
import { signup, login, registerUser } from '../controllers/authController.js';
import { adminMiddleware } from '../middlewares/authMiddleware.js';
import { validateSignup, validateLogin, validateRegisterUser } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup); // Admin only
router.post('/login', validateLogin, login);
router.post('/register', adminMiddleware,  registerUser); // Admin only

export default router;
