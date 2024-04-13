import { GetAllSalesRequestQuery } from '@src/types/sales.types'
import { Op } from 'sequelize'

export const findQueryGenerators = (queryData: GetAllSalesRequestQuery, additionalData: any) => {
  const { skip, limit, sort, search } = queryData

  const findQuery: any = {}
  skip && (findQuery['offset'] = skip)
  limit && (findQuery['limit'] = limit)
  sort && (findQuery['order'] = Object.entries(sort).map(([key, value]) => [key, value]))

  if (search) {
    findQuery['where'] = {
      [Op.iLike]: `%${search}%`,
    }
  }

  if (additionalData) {
    Object.assign(findQuery, additionalData)
  }

  if (findQuery.include) {
    if (Array.isArray(findQuery.include)) {
      findQuery.include = findQuery.include.map((include: any) => {
        if (typeof include === 'object') {
          if (include.where) {
            include.where = {
              ...include.where,
              ...findQuery.where,
            }
          } else {
            include.where = findQuery.where
          }
        }
        return include
      })
    }
  }

  return findQuery
}
