import Sale from '@database/models/sale'
import Store from '@database/models/store'
import User from '@database/models/user'
import { GetAllRequestQuery } from '@src/types/sales.types'
import { ClientTypesEnum } from '@src/types/user.types'
import { findQueryGenerators } from '@src/utils/generators'
import { IncludeOptions, WhereOptions } from 'sequelize'
// import { Op } from 'sequelize'

class SaleServices {
  static async getAllSales(
    queryData: GetAllRequestQuery,
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

    const { count, rows } = await Sale.findAndCountAll(
      findQueryGenerators(Sale.getAttributes(), queryData, additionalData)
    )
    return { total: count, sales: rows }
  }
}

export default SaleServices
