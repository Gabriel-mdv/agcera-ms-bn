import ProductsController from '@src/controllers/productsController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '@src/middlewares/checkAuth';
import upload from '@src/middlewares/multer';
import { validate } from '@src/middlewares/validation';
import { createNewProductSchema, updateProductSchema } from '@src/validation/products.validation';
import { Router } from 'express';

const router = Router();

router.get('/', isLoggedIn, ProductsController.getAllProducts);
router.get('/:id', isLoggedIn, ProductsController.getOneProduct);
router.post(
  '/',
  isAdmin,
  validate(createNewProductSchema),
  upload.single('image'),
  ProductsController.createNewProduct
);
router.patch(
  '/:id',
  isStoreKeeperUp,
  upload.single('image'),
  validate(updateProductSchema),
  ProductsController.updateProduct
);
router.delete('/:id', isAdmin, ProductsController.deleteProduct);

// Variations related routes

// router.get("/:id/variations", isLoggedIn);

export default router;
