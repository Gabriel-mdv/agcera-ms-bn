import { SortDirectionEnum } from '@src/types/common.types';
import { formatSortQuery } from '@src/utils/formatters';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const getAllRequestQuerySchema = Joi.object({
  search: Joi.string(),
  limit: Joi.number().integer().min(1),
  skip: Joi.number().integer().min(0),
  sort: Joi.object().pattern(Joi.string(), Joi.valid(...Object.values(SortDirectionEnum))),
});
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

const uuidSchema = Joi.object({ id: Joi.string().uuid().required() });
export const validateParams = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (id) {
    // validate the id parameter
    const { error, value } = uuidSchema.validate({ id });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
    req.params.id = value.id;
  }

  // Other parameters validation

  return next();
};
