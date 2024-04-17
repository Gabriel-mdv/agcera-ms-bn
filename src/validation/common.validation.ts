import { SortDirectionEnum } from '@src/types/common.types'
import { GetAllRequestQuery } from '@src/types/sales.types'
import * as Joi from 'joi'

const getAllRequestQuerySchema = Joi.object({
  search: Joi.string().optional(),
  limit: Joi.number().integer().min(1).optional(),
  skip: Joi.number().integer().min(0).optional(),
  sort: Joi.object()
    .pattern(Joi.string(), Joi.valid(...Object.values(SortDirectionEnum)))
    .optional(),
})

export const validateGetAllRequestQuery = (data: GetAllRequestQuery) => getAllRequestQuerySchema.validate(data)

const uuidSchema = Joi.object({ id: Joi.string().uuid().required() })
export const validateUUIDV4 = (id: string) => uuidSchema.validate({ id })
