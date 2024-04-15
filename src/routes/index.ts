import { Router } from 'express'
import usersRoute from './usersRoute'
import storesRoutes from './storesRoutes'
import salesRoutes from './salesRoutes'
import productsRoutes from './productsRoutes'

const router = Router()

router.use('/users', usersRoute)
router.use('/stores', storesRoutes)
router.use('/sales', salesRoutes)
router.use('/products', productsRoutes)

export default router
