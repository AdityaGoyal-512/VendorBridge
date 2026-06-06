import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Admin-only: list all users and delete (deactivate) users
router.get('/', authorize('admin'), getAllUsers);
router.delete('/:id', authorize('admin'), deleteUser);

// Admin + self: view and update
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
