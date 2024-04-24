import ProductsController from '@src/controllers/productsController';
import { isAdmin, isLoggedIn } from '@src/middlewares/checkAuth';
import upload from '@src/middlewares/multer';
import { validate, validateParams, validateProductExist } from '@src/middlewares/validation';
import { createNewProductSchema, updateProductSchema } from '@src/validation/products.validation';
import { Router } from 'express';

const router = Router();
const productsController = new ProductsController();

router.get('/', isLoggedIn, productsController.getAllProducts);
router.get('/:id', isLoggedIn, validateParams(), productsController.getOneProduct);
router.post(
  '/',
  upload.single('image'),
  isAdmin,
  validate(createNewProductSchema),
  productsController.createNewProduct
);
router.patch(
  '/:id',
  upload.single('image'),
  isAdmin,
  validateParams(),
  validate(updateProductSchema),
  productsController.updateProduct
);
router.delete('/:id', isAdmin, validateParams(), productsController.deleteProduct);

// Variations related routes

router.get(
  '/:productId/variations',
  isLoggedIn,
  validateParams(['productId']),
  validateProductExist,
  productsController.getAllVariations
);
router.delete(
  '/:productId/variations/:id',
  isAdmin,
  validateParams(['productId', 'id']),
  validateProductExist,
  productsController.deleteVariation
);

export default router;
