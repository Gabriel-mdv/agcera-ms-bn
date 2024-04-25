import ProductServices from '@src/services/product.services';
import { ExtendedRequest } from '@src/types/common.types';
import { formatSortQuery } from '@src/utils/formatters';
import { getAllRequestQuerySchema, uuidSchema } from '@src/validation/common.validation';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
  req.body = value;
  return next();
};

export const validateProductExist = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  console.log('productId => ', productId);

  const product = await ProductServices.getProductByPk(productId);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: `Product with id ${productId}, not found`,
    });
  }

  (req as ExtendedRequest).product = product;
  return next();
};

export const validateQueries = (req: Request, res: Response, next: NextFunction) => {
  const { search, limit, skip, sort } = req.query;

  // Run below code if atleast one of the query parameters is present
  if (search || limit || skip || sort) {
    if (sort && typeof sort === 'string') req.query.sort = formatSortQuery(sort);

    const { error, value } = getAllRequestQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
    req.query = value;
  }

  return next();
};

export const validateParams =
  (idFields: string[] = ['id']) =>
  (req: Request, res: Response, next: NextFunction) => {
    for (let i = 0; i <= idFields.length; i++) {
      const idField = idFields[i];
      const id = req.params[idField];

      if (id) {
        // validate the id parameter
        const { error, value } = uuidSchema.validate({ id });
        if (error) {
          return res.status(400).json({
            status: 'fail',
            message: error.message,
          });
        }
        req.params[idField] = value.id;
      }
    }

    // Other parameters validation

    return next();
  };
