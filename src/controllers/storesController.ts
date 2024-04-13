import { Request, Response } from 'express'
import { storeRegisterSchema, storeUpdateSchema } from '../validation/store.validation'
import { UniqueConstraintError } from 'sequelize'
import StoreServices from '@src/services/store.services'

class storesController {
  static async createStore(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { error, value } = storeRegisterSchema.validate(req.body)

      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: error.message,
        })
      }

      const { name, location, phone } = value

      const shop = await StoreServices.create({ name, location, phone, isOpen: true })

      if (!shop) {
        return res.status(400).json({
          status: 'fail',
          message: 'Failed to create shop',
        })
      }

      return res.status(201).json({
        status: 'success',
        data: shop,
      })
    } catch (e: any) {
      if (e instanceof UniqueConstraintError) {
        return res.status(400).json({
          status: 'fail',
          message: 'Store already exists',
        })
      } else {
        return res.status(500).json({
          status: 'fail',
          message: e.message,
        })
      }
    }
  }

  // get all shops
  static async getStores(req: Request, res: Response): Promise<Response | undefined> {
    try {
      // use the relation of shops and users to also get the users in the shop
      const shops = await StoreServices.getAllStores()

      return res.status(200).json({
        status: 'success',
        data: shops,
      })
    } catch (e: any) {
      return res.status(500).json({
        status: 'fail',
        message: e.message,
      })
    }
  }

  // get a single shop
  static async singleStore(req: Request, res: Response): Promise<Response | undefined> {
    try {
      // use the relation of shops and users to also get the users in the shop

      const shop = await StoreServices.getStoreById(req.params.id)

      if (!shop) {
        return res.status(404).json({
          status: 'fail',
          message: 'Shop not found',
        })
      }

      return res.status(200).json({
        status: 'success',
        data: shop,
      })
    } catch (e: any) {
      return res.status(500).json({
        status: 'fail',
        message: e.message,
      })
    }
  }

  // update store
  static async updateStore(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { error, value } = storeUpdateSchema.validate(req.body)

      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: error.message,
        })
      }

      // get the name location and phone only if they are available
      const { name, location, phone } = value

      const shop = await StoreServices.getStoreById(req.params.id)

      if (!shop) {
        return res.status(404).json({
          status: 'fail',
          message: 'Shop not found',
        })
      }

      name ? (shop.name = name) : null
      location ? (shop.location = location) : null
      phone ? (shop.phone = phone) : null

      await shop.save()

      return res.status(200).json({
        status: 'success',
        data: shop,
      })
    } catch (e: any) {
      return res.status(500).json({
        status: 'fail',
        message: e.message,
      })
    }
  }

  // delete store
  static async deleteStore(req: Request, res: Response): Promise<Response | undefined> {
    try {
      // delete the store from the db by simply setting the deletedAt column to the current date use the model
      const deleted = await StoreServices.deleteStore(req.params.id)

      if (!deleted) {
        return res.status(400).json({
          status: 'fail',
          message: 'Failed to delete store! check if store is available',
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'Store deleted',
      })
    } catch (e: any) {
      console.log(e)
      return res.status(500).json({
        status: 'fail',
        message: e.message,
      })
    }
  }
}

export default storesController
