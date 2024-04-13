import { PaymentMethodsEnum } from '@database/models/sale'
import { ClientTypesEnum } from '@database/models/user'
import { SortDirectionEnum } from './common.types'

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
