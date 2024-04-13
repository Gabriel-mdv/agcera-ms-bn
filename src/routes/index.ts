import { Router } from 'express'
import usersRoute from './usersRoute'
import storesRoutes from './storesRoutes'
import salesRoutes from './salesRoutes'

const router = Router()

router.use('/users', usersRoute)
router.use('/stores', storesRoutes)
router.use('/sales', salesRoutes)

export default router
