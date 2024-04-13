import { PaymentMethodsEnum } from '@database/models/sale'
import { ClientTypesEnum } from '@database/models/user'
import Joi from 'joi'

const paymentMethodValues = Object.values(PaymentMethodsEnum)
const clientTypeValues = Object.values(ClientTypesEnum)

export type CreateSaleProduct = {
  productId: string
  quantity: number
}

const createSaleSchema = Joi.object({
  products: Joi.object()
    .pattern(Joi.string().required(), Joi.number().integer().required())
    .min(1)
    .required()
    .messages({
      'object.base': 'products should be an object of `productId: quantity`',
    }),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethodsEnum))
    .required()
    .messages({
      'string.base': 'payment method should be a string',
      'string.valid': `payment method should one of [${paymentMethodValues.join(', ')}]`,
      'any.required': 'payment method is required',
    }),
  clientId: Joi.string().required().messages({
    'string.base': 'clientId should be a string',
    'any.required': 'clientId is required',
  }),
  clientType: Joi.string()
    .valid(...Object.values(ClientTypesEnum))
    .required()
    .messages({
      'string.base': 'clientType should be a string',
      'string.valid': `clientType should be one of [${clientTypeValues.join(', ')}]`,
      'any.required': 'clientType is required',
    }),
  shopId: Joi.string().required().messages({
    'string.base': 'shopId should be a string',
    'any.required': 'shopId is required',
  }),
})

export const validateCreateSale = (data: any) => createSaleSchema.validate(data)
