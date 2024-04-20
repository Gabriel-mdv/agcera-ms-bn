import { Router } from 'express';
import ShopsController from '../controllers/storesController';
import { isAdmin, isStoreKeeperUp } from '@src/middlewares/checkAuth';
import { validate, validateParams } from '@src/middlewares/validation';
import { storeRegisterSchema, storeUpdateSchema } from '@src/validation/store.validation';

const router = Router();
const shopsController = new ShopsController();

router.post('/', isAdmin, validate(storeRegisterSchema), shopsController.createStore);
router.get('/', isStoreKeeperUp, shopsController.getStores);
router.get('/:id', isStoreKeeperUp, validateParams(), shopsController.singleStore);
router.patch('/:id', isStoreKeeperUp, validateParams(), validate(storeUpdateSchema), shopsController.updateStore);
router.delete('/:id', isAdmin, validateParams(), shopsController.deleteStore);

export default router;
