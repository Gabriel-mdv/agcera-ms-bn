import { PaymentMethodsEnum } from '@database/models/sale';
import { SortDirectionEnum } from './common.types';
import { ClientTypesEnum } from './user.types';

export interface CreateSaleRequestProducts {
  [key: string]: number;
}

export interface CreateSaleRequest {
  products: CreateSaleRequestProducts;
  paymentMethod: PaymentMethodsEnum;
  clientId: string;
  clientType: ClientTypesEnum;
  shopId: number;
}

export interface GetAllRequestQuery<
  Sort extends { [key: string]: SortDirectionEnum } | string = { [key: string]: SortDirectionEnum },
> {
  search?: string;
  skip?: number;
  limit?: number;
  sort?: Sort;
}
