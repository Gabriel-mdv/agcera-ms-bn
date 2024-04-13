import { GetAllSalesRequestQuery } from '@src/types/sales.types'
import { Response } from 'express'

// Can return error
export const formatSortQuery = (data: string, res: Response): GetAllSalesRequestQuery['sort'] | Response => {
  const sorts = data.split(',').map((sort) => sort.trim())
  const sortQuery: any = {}

  for (const sort of sorts) {
    if (!sort.includes(':')) {
      if (res) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid sort query, must be in the format key:(ASC or DESC)]',
        })
      }
      throw new Error('')
    }
    const [key, value] = sort.split(':').map((sort) => sort.trim())
    sortQuery[key] = value
  }

  return sortQuery
}
