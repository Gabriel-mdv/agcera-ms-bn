import { GetAllRequestQuery } from '@src/types/sales.types'
import { Op } from 'sequelize'

export const findQueryGenerators = (
  modelAttributes: { [key: string]: any },
  queryData?: GetAllRequestQuery,
  additionalData?: any
) => {
  const { skip, limit, sort, search } = queryData ?? {}

  const findQuery: any = { distinct: true }

  skip && (findQuery['offset'] = skip)
  limit && (findQuery['limit'] = limit)
  sort && (findQuery['order'] = Object.entries(sort).map(([key, value]) => [key, value]))

  if (additionalData) {
    Object.assign(findQuery, additionalData)
  }

  if (search) {
    const attributesSearch = Object.entries(modelAttributes).reduce((prev, [attribute, attributeValue]) => {
      if (attributeValue.type.constructor.name === 'STRING') {
        prev.push({
          [attribute]: { [Op.like]: `%${search}%` },
        })
      }
      return prev
    }, [] as any[])

    findQuery.where = {
      ...findQuery['where'],
      [Op.or]: attributesSearch,
    }

    // if (findQuery.include && Array.isArray(findQuery.include)) {
    //   findQuery.include = findQuery.include.map((include: IncludeOptions) => {
    //     if (typeof include === 'object') {
    //       if (include.where && search) {
    //         include.where = {
    //           ...include['where'],
    //           // [Op.or]: attributesSearch,
    //         }
    //       } else {
    //         // include['where'] = {
    //         //   [Op.or]: attributesSearch,
    //         // }
    //       }
    //     }
    //     return include
    //   })
    // }
  }

  return findQuery
}
