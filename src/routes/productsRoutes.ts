import ProductsController from '@src/controllers/productsController'
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '@src/middlewares/checkAuth'
import upload from '@src/middlewares/multer'
// import upload from '@src/middlewares/multer'
import { ControllerWrapper } from '@src/utils/wrappers'
import { Router } from 'express'

const router = Router()

router.get('/', isLoggedIn, ControllerWrapper(ProductsController.getAllProducts))
router.get('/:id', isLoggedIn, ControllerWrapper(ProductsController.getOneProduct))
router.post('/', isAdmin, upload.single('image'), ControllerWrapper(ProductsController.createNewProduct))
router.patch('/:id', isStoreKeeperUp, upload.single('image'), ControllerWrapper(ProductsController.updateProduct))
router.delete('/:id', isAdmin, ControllerWrapper(ProductsController.deleteProduct))

export default router
