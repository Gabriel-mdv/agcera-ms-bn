import { Router } from 'express';
import usersRoute from './usersRoute'
import shopsRoute from './shopsRoute'

const router = Router();

router.use('/users', usersRoute);
router.use('/shops', shopsRoute);

export default router;
