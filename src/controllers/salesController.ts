// import SalesServices from '@src/services/salesServices'
import { validateCreateSale } from '@src/validation/sales.validation'
import { type Request, type Response } from 'express'

class SalesController {
  static async createSale(req: Request, res: Response): Promise<Response | undefined> {
    const { error, value } = validateCreateSale(req.body)

    return res.status(200).json({
      message: 'Sale created successfully',
      data: { error, value },
    })
  }
}

export default SalesController
