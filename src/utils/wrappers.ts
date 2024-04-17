import { RequestWithUser } from '@src/types/common.types'
import { Response } from 'express'

export const ControllerWrapper =
  (controller: (...props: any) => Promise<Response>) => async (req: Request | RequestWithUser, res: Response) => {
    try {
      return await controller(req, res)
    } catch (error: any) {
      console.log('\n\x1b[32m An error occurred ===> \x1b[37m', error)
      return res.status(500).json({
        status: 500,
        // message: error.message,
        message: 'An Unexpected error occurred. Please try again later.',
      })
    }
  }
