import { Router } from 'express'
import usersRoute from './usersRoute'
import shopRoutes from './storesRoutes'

const router = Router()

router.use('/users', usersRoute);
router.use('/stores', shopRoutes)


export default router;
