import { Router } from 'express'
import ShopsController from '../controllers/storesController'
import { isAdmin, isStoreKeeperUp } from '@src/middlewares/checkAuth'
import { ControllerWrapper } from '@src/utils/wrappers'

const router = Router()

router.post('/', isAdmin, ControllerWrapper(ShopsController.createStore))
router.get('/', isStoreKeeperUp, ControllerWrapper(ShopsController.getStores))
router.get('/:id', isStoreKeeperUp, ControllerWrapper(ShopsController.singleStore))
router.patch('/:id', isStoreKeeperUp, ControllerWrapper(ShopsController.updateStore))
router.delete('/:id', isAdmin, ControllerWrapper(ShopsController.deleteStore))

export default router
