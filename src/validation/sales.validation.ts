import { PaymentMethod } from '@database/models/sale'
import { ClientType } from '@database/models/user'
import Joi from 'joi'

const paymentMethodValues = Object.values(PaymentMethod)
const clientTypeValues = Object.values(ClientType)

export type CreateSaleProduct = {
  productId: string
  quantity: number
}

const createSaleSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'string.base': 'productId should be a string',
          'any.required': 'productId is required',
        }),
        quantity: Joi.number().min(1).required().messages({
          'number.base': 'quantity should be a number',
          'number.min': 'quantity should be at least 1',
          'any.required': 'quantity is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'products should be an array of productId, quantity',
      'array.min': 'At least one product is required',
      'any.required': 'products are required',
    }),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
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
    .valid(...Object.values(ClientType))
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
