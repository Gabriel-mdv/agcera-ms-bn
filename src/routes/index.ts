import { Router } from 'express'
import usersRoute from './usersRoute'
import shopRoutes from './storesRoutes'
import salesRoutes from './salesRoutes'

const router = Router()

router.use('/users', usersRoute)
router.use('/stores', shopRoutes)
router.use('/sales', salesRoutes)

export default router
