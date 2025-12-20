import { Router } from 'express';
import { categoriesController } from '../controllers/categories_controller.js';
import { authenticate } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/is_admin.js';

const router = Router();

router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategoryById);

router.post('/', authenticate, isAdmin, categoriesController.createCategory);
router.put('/:id', authenticate, isAdmin, categoriesController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoriesController.deleteCategory);

export default router;

