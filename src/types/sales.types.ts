import { PaymentMethodsEnum } from '@database/models/sale'
import { SortDirectionEnum } from './common.types'
import { ClientTypesEnum } from './user.types'

export interface CreateSaleRequestProducts {
  [key: string]: number
}

export interface CreateSaleRequest {
  products: CreateSaleRequestProducts
  paymentMethod: PaymentMethodsEnum
  clientId: string
  clientType: ClientTypesEnum
  shopId: number
}

export interface GetAllSalesRequestQuery<Sort = { [key: string]: SortDirectionEnum } | string> {
  search: string | null
  skip: number | null
  limit: number | null
  sort: Sort
}
