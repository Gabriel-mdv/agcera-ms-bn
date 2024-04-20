import { SortDirectionEnum } from '@src/types/common.types';
import Joi from 'joi';

export const getAllRequestQuerySchema = Joi.object({
  search: Joi.string(),
  limit: Joi.number().integer().min(1),
  skip: Joi.number().integer().min(0),
  sort: Joi.object().pattern(Joi.string(), Joi.valid(...Object.values(SortDirectionEnum))),
});

export const uuidSchema = Joi.object({ id: Joi.string().uuid().required() });
