import StoreServices from '@src/services/store.services';
import { ExtendedRequest } from '@src/types/common.types';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { storeRegisterSchema, storeUpdateSchema } from '../validation/store.validation';

class storesController {
  static async createStore(req: Request, res: Response): Promise<Response> {
    const { error, value } = storeRegisterSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }

    const { name, location, phone, isActive } = value;

    const store = await StoreServices.getOneStore({ [Op.or]: [{ name }, { phone }] });

    if (store?.name === name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Store with this name already exists',
      });
    }
    if (store?.phone === phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'Store with this phone number already exists',
      });
    }

    const newStore = await StoreServices.create({ name, location, phone, isActive });

    return res.status(201).json({
      status: 'success',
      data: newStore,
    });
  }

  // get all shops
  static async getStores(req: ExtendedRequest, res: Response): Promise<Response> {
    const user = req.user!;
    const { search, limit, skip, sort } = req.query;

    const where: any = {};
    const include: any = [];

    if (user.role === 'keeper') {
      include.push({ association: 'users', where: { id: user.id } });
    }

    const { stores, total } = await StoreServices.getAllStores({ search, limit, skip, sort }, where, include);

    return res.status(200).json({
      status: 'success',
      data: { stores, total },
    });
  }

  // get a single shop
  static async singleStore(req: ExtendedRequest, res: Response): Promise<Response> {
    const { role, id: userId } = req.user!;
    const { id } = req.params;

    // use the relation of shops and users to also get the users in the shop
    const shop = await StoreServices.getOneStore({ id });

    if (role === 'keeper' && !shop?.users?.find((user) => user.id === userId)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to view this shop info or the shop does not exist',
      });
    }

    if (!shop) {
      return res.status(404).json({
        status: 'fail',
        message: 'Shop not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: shop,
    });
  }

  // update store
  static async updateStore(req: ExtendedRequest, res: Response): Promise<Response> {
    const { id: userId, role: userRole } = req.user!;

    // Validate the param id
    const { id } = req.params;

    // validate the update request body
    const { error, value } = storeUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
    const { name, location, phone, isActive } = value;

    // get the to be updated store
    const store = await StoreServices.getStoreById(id);

    // check if the user is a keeper of this store to allow him to update the store
    if (userRole === 'keeper' && !store?.users?.find((user) => user.id === userId)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to update this store info or the store does not exist',
      });
    }
    // check if the store exists
    if (!store) {
      return res.status(404).json({
        status: 'fail',
        message: 'Shop not found',
      });
    }

    // Stop the operation if we are trying to update the main store name
    if (name && store.name === 'main' && name !== 'main') {
      return res.status(403).json({
        status: 'fail',
        message: 'You cannot update the main store name',
      });
    }

    // update the store
    name && (store.name = name);
    phone && (store.phone = phone);
    location && (store.location = location);
    typeof isActive === 'boolean' && (store.isActive = isActive);

    // get another store with the same name or phone number
    const duplicateStore = await StoreServices.getOneStore({
      [Op.or]: [{ name: store.name }, { phone: store.phone }],
      id: { [Op.not]: id },
    });

    // provide appropriate error message if it exists
    if (name && duplicateStore?.name === name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Store with this name already exists',
      });
    }
    if (phone && duplicateStore?.phone === phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'Store with this phone number already exists',
      });
    }

    // save the store
    await store.save();

    return res.status(200).json({
      status: 'success',
      data: store,
    });
  }

  // delete store
  static async deleteStore(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const store = await StoreServices.getStoreById(id);
    if (!store) {
      return res.status(404).json({
        status: 'fail',
        message: 'Store not found',
      });
    }

    if (store.name === 'main') {
      return res.status(403).json({
        status: 'fail',
        message: 'You cannot delete the main store',
      });
    }

    // delete the store
    await store.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Store deleted successfully',
    });
  }
}

export default storesController;
