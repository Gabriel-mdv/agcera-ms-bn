import ProductsController from '@src/controllers/productsController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '@src/middlewares/checkAuth';
import upload from '@src/middlewares/multer';
import { Router } from 'express';

const router = Router();

router.get('/', isLoggedIn, ProductsController.getAllProducts);
router.get('/:id', isLoggedIn, ProductsController.getOneProduct);
router.post('/', upload.single('image'), isAdmin, ProductsController.createNewProduct);
router.patch('/:id', upload.single('image'), isStoreKeeperUp, ProductsController.updateProduct);
router.delete('/:id', isAdmin, ProductsController.deleteProduct);

// Variations related routes

// router.get("/:id/variations", isLoggedIn);

export default router;
