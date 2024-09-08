import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, restoreUser, permanentDeleteUser, assignRole, revokeRole } from '../controllers/userController.js';
import { authMiddleware, adminMiddleware, adminManagerMiddleware } from '../middlewares/authMiddleware.js';
import { validateCreateUser, validateUpdateUser } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/', adminMiddleware, validateCreateUser, createUser);
router.get('/', adminManagerMiddleware, getUsers); // Admin and Manager
router.get('/:id', authMiddleware, getUserById); // All users
router.put('/:id', adminMiddleware, validateUpdateUser, updateUser);
router.delete('/:id', adminMiddleware, deleteUser);
router.delete('/permanent/:id', adminMiddleware, permanentDeleteUser); // Optional
router.patch('/restore/:id', adminMiddleware, restoreUser);
router.post('/:id/assign-role', adminMiddleware, assignRole);
router.post('/:id/revoke-role', adminMiddleware, revokeRole);

export default router;
