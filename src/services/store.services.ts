import Store from '@database/models/store'
import { GetAllRequestQuery } from '@src/types/sales.types'
import { findQueryGenerators } from '@src/utils/generators'
import { IncludeOptions, WhereOptions } from 'sequelize'

class StoreServices {
  private store: Store

  constructor() {
    this.store = new Store()
  }

  // create store
  static async create(data: any) {
    return await Store.create(data)
  }

  // get all stores
  static async getAllStores(queryData?: GetAllRequestQuery, where?: WhereOptions, includes?: IncludeOptions[]) {
    const include: IncludeOptions[] = [
      {
        association: 'users',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'storeId'] },
      },
      // {
      //   association: 'products',
      //   attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      // },
      ...(includes ?? []),
    ]

    const { count, rows } = await Store.findAndCountAll(
      findQueryGenerators(Store.getAttributes(), queryData, { where, include })
    )

    return { total: count, stores: rows }
  }

  // get one store
  static async getOneStore(where: WhereOptions) {
    return await Store.findOne({
      where,
      include: [
        {
          association: 'users',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'storeId'] },
        },
        // {
        //   association: 'products',
        //   attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        // },
      ],
    })
  }

  // get store by id
  static async getStoreById(id: string) {
    return await Store.findByPk(id, {
      include: [
        {
          association: 'users',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'storeId'] },
        },
        // {
        //   association: 'products',
        //   attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        // },
      ],
    })
  }

  // update store
  static async updateStore(id: string, data: any) {
    const store = await Store.findByPk(id)

    if (!store) {
      return null
    }

    store.name = data.name
  }
}

export default StoreServices
