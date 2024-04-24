import Store from '@database/models/store';
import { GetAllRequestQuery } from '@src/types/sales.types';
import { findQueryGenerators } from '@src/utils/generators';
import { IncludeOptions, WhereOptions } from 'sequelize';

class StoreServices {
  private store: Store;
  static DEFAULT_INCLUDES: IncludeOptions[] = [
    {
      association: 'users',
      attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'storeId'] },
    },
    {
      association: 'products',
      include: [
        {
          association: 'store',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
        {
          association: 'product',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    },
  ];

  constructor() {
    this.store = new Store();
  }

  // create store
  static async create(data: any) {
    return await Store.create(data);
  }

  // get all stores
  static async getAllStores(queryData?: GetAllRequestQuery, where?: WhereOptions, includes?: IncludeOptions[]) {
    const include: IncludeOptions[] = [this.DEFAULT_INCLUDES[0], ...(includes ?? [])];

    const { count, rows } = await Store.findAndCountAll(
      findQueryGenerators(Store.getAttributes(), queryData, { where, include })
    );

    return { total: count, stores: rows };
  }

  // get one store
  static async getOneStore(where: WhereOptions) {
    return await Store.findOne({
      where,
      include: this.DEFAULT_INCLUDES,
    });
  }

  // get store by id
  static async getStoreById(id: string) {
    return await Store.findByPk(id, {
      include: this.DEFAULT_INCLUDES,
    });
  }

  // update store
  static async updateStore(id: string, data: any) {
    const store = await Store.findByPk(id);

    if (!store) {
      return null;
    }

    store.name = data.name;
  }
}

export default StoreServices;
