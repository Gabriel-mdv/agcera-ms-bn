import SaleServices from '@src/services/sale.services';
import { ExtendedRequest } from '@src/types/common.types';
import { ClientTypesEnum } from '@src/types/user.types';
import { Request, type Response } from 'express';
import { IncludeOptions, WhereOptions } from 'sequelize';

class SalesController {
  static async createSale(req: Request, res: Response): Promise<Response | undefined> {
    try {
      // const { error } = validateCreateSale(req.body)
      // if (error) {
      //   return res.status(400).json({
      //     status: 400,
      //     message: error.message,
      //   })
      // }

      // const user = req.user
      // const { products, paymentMethod, clientId, clientType, shopId }: CreateSaleRequest = req.body

      // // Check products exists and are available in the shop
      // const productsIds = Object.keys(products)
      // for (const productId of productsIds) {
      //   const product = await SaleServices.getProductById(productId, { shopId })
      // }
      // console.log(user?.email, products, paymentMethod, clientId, clientType, shopId)

      return res.status(200).json({
        status: 200,
        message: 'Sale created successfully',
      });

      // const sale = await SaleServices.createSale(user, products, paymentMethod, clientId, clientType, shopId)
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: 'Internal server error',
      });
    }
  }

  static async getAllSales(req: ExtendedRequest, res: Response): Promise<Response> {
    try {
      const { role: userRole, id: userId } = req.user!;
      const { search, limit, skip, sort } = req.query;

      const where: WhereOptions = {};
      const include: IncludeOptions[] = [];

      switch (userRole) {
        case 'user':
          where['clientId'] = userId;
          where['clientType'] = ClientTypesEnum.USER;
          break;
        case 'keeper':
          // include.push({ model: Store, as: 'store', where: { keeperId: userId } })
          break;
        case 'admin':
          break;
      }

      const { sales, total } = await SaleServices.getAllSales(
        {
          search,
          limit,
          skip,
          sort,
        },
        where,
        include
      );

      return res.status(200).json({
        status: 200,
        message: {
          data: sales,
          total: total,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }
}

export default SalesController;
