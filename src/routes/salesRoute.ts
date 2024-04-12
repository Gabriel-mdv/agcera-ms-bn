import { Router } from 'express'
import salesController from '../controllers/salesController'

const router: Router = Router()

router.post('/', salesController.createSale)

export default router
