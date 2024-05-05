import { PaymentMethodsEnum } from '@database/models/sale';
import { ClientTypesEnum } from '@src/types/user.types';
import Joi from 'joi';

export type CreateSaleProduct = {
  productId: string;
  quantity: number;
};

export const createSaleSchema = Joi.object({
  products: Joi.object().pattern(Joi.string().required(), Joi.number().integer().required()).min(1).required(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethodsEnum))
    .required(),
  clientId: Joi.alternatives()
    .try(
      Joi.string()
        .pattern(/^\+\d{12}$/)
        .message('Please provide a valid phone number that starts with + and have 12 digits for clientId'),
      Joi.string().guid().message('Invalid UUID for clientId')
    )
    .required(),
  clientType: Joi.string()
    .valid(...Object.values(ClientTypesEnum))
    .required(),
  storeId: Joi.string().uuid().required(),
});
