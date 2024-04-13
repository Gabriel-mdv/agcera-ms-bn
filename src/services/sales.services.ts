import Sale from '@database/models/sale'
import Store from '@database/models/store'
import User, { ClientTypesEnum } from '@database/models/user'
import { GetAllSalesRequestQuery } from '@src/types/sales.types'
import { findQueryGenerators } from '@src/utils/generators'
import { IncludeOptions, WhereOptions } from 'sequelize'
// import { Op } from 'sequelize'

class SalesServices {
  static async getAllSales(
    queryData: GetAllSalesRequestQuery,
    where: WhereOptions<Sale> | null = null,
    include: IncludeOptions | IncludeOptions[] | null = null
  ) {
    const additionalData: any = {}
    where && (additionalData['where'] = where)
    if (include) {
      additionalData['include'] = include
    } else {
      additionalData['include'] = [
        { model: User, as: 'client', where: { clientType: ClientTypesEnum.USER } },
        { model: Store, as: 'store' },
      ]
    }

    const { count, rows } = await Sale.findAndCountAll(findQueryGenerators(queryData, additionalData))
    return { total: count, sales: rows }
  }
}

export default SalesServices
