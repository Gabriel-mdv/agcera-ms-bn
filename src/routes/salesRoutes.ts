import { isStoreKeeperUp } from '@src/middlewares/checkAuth'
import { Router } from 'express'
import salesController from '../controllers/salesController'

const router: Router = Router()

// router.get('/', isLoggedIn, salesController.getAllSales)
router.post('/', isStoreKeeperUp, salesController.createSale)

export default router
