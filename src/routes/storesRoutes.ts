import { Router } from 'express';
import ShopsController from '../controllers/storesController';
import { isAdmin, isStoreKeeperUp } from '@src/middlewares/checkAuth';
import { validate } from '@src/middlewares/validation';
import { storeRegisterSchema, storeUpdateSchema } from '@src/validation/store.validation';

const router = Router();

router.post('/', isAdmin, validate(storeRegisterSchema), ShopsController.createStore);
router.get('/', isStoreKeeperUp, ShopsController.getStores);
router.get('/:id', isStoreKeeperUp, ShopsController.singleStore);
router.patch('/:id', isStoreKeeperUp, validate(storeUpdateSchema), ShopsController.updateStore);
router.delete('/:id', isAdmin, ShopsController.deleteStore);

export default router;
