import Store from "@database/models/store";

class StoreServices {
  private store: Store;

  constructor() {
    this.store = new Store();
  }

  // create store
  static async create(data: any) {
    return await Store.create(data);
  }


  // get all stores
  static async getAllStores() {
      return await Store.findAll( {where: {deletedAt: null}, include: {association: 'users', 
    attributes: ['name', 'phone', 'email']}});
  }

  // get store by id
  static async getStoreById(id: string) {
    return await Store.findByPk(id,{include: {association: 'users', 
    attributes: ['name', 'phone', 'email']}});
  }

  // update store
  static async updateStore(id: string, data: any) {
    const store = await Store.findByPk(id);

    if (!store) {
      return null;
    }

    store.name = data.name;
  }

  // delete store
  static async deleteStore(id: string) {
    const store = await Store.findByPk(id);

    if (!store) {
      return null;
    }

    store.deletedAt = new Date();
    await store.save();
  }

}


export default StoreServices;





