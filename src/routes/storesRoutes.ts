import { Router } from 'express';
import StoreController from '../controllers/storesController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '@src/middlewares/checkAuth';
import { validate, validateParams } from '@src/middlewares/validation';
import { storeRegisterSchema, storeUpdateSchema } from '@src/validation/store.validation';

const router = Router();
const storesController = new StoreController();

router.post('/', isAdmin, validate(storeRegisterSchema), storesController.createStore);
router.get('/', isLoggedIn, storesController.getStores);
router.get('/:id', isLoggedIn, validateParams(), storesController.singleStore);
router.patch('/:id', isStoreKeeperUp, validateParams(), validate(storeUpdateSchema), storesController.updateStore);
router.delete('/:id', isAdmin, validateParams(), storesController.deleteStore);

router.get('/:storeId/products', isLoggedIn, validateParams(), storesController.getStoreProducts);
router.get('/:storeId/users', isStoreKeeperUp, validateParams(), storesController.getStoreUsers);

export default router;
