import { ProductTypesEnum } from '@src/types/product.types';
import Joi from 'joi';

export const createNewProductSchema = Joi.object({
  name: Joi.string().min(3).required(),
  type: Joi.string()
    .valid(...Object.values(ProductTypesEnum))
    .required(),
  description: Joi.string().optional(),
  variations: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(3).required(),
        costPrice: Joi.number().min(0).required(),
        sellingPrice: Joi.number().min(Joi.ref('costPrice')).required(),
        description: Joi.string().optional(),
      })
    )
    .unique('name')
    .min(1)
    .required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string(),
  variations: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(3),
        costPrice: Joi.number().min(0),
        sellingPrice: Joi.number().min(Joi.ref('costPrice')),
        description: Joi.string(),
      })
    )
    .unique('name')
    .min(1),
});
