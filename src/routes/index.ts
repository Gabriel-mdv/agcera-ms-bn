import { validateParams, validateQueries } from '@src/validation/common.validation';
import { Router } from 'express';
import productsRoutes from './productsRoutes';
import salesRoutes from './salesRoutes';
import storesRoutes from './storesRoutes';
import usersRoute from './usersRoute';

const router = Router();

// Register the always used middlewares
router.use(validateParams, validateQueries);

router.use('/users', usersRoute);
router.use('/stores', storesRoutes);
router.use('/products', productsRoutes);
router.use('/sales', salesRoutes);

router.post('/error', () => {
  throw new Error('This is an error');
});

export default router;
