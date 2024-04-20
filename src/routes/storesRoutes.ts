import { Router } from 'express';
import ShopsController from '../controllers/storesController';
import { isAdmin, isStoreKeeperUp } from '@src/middlewares/checkAuth';

const router = Router();

router.post('/', isAdmin, ShopsController.createStore);
router.get('/', isStoreKeeperUp, ShopsController.getStores);
router.get('/:id', isStoreKeeperUp, ShopsController.singleStore);
router.patch('/:id', isStoreKeeperUp, ShopsController.updateStore);
router.delete('/:id', isAdmin, ShopsController.deleteStore);

export default router;
