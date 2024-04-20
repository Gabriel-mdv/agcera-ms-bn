import User from '@database/models/user';
import { Request } from 'express';
import * as core from 'express-serve-static-core';
import { GetAllRequestQuery } from './sales.types';
import Product from '@database/models/product';

export interface ExtendedRequest<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = GetAllRequestQuery>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: User;
  product?: Product;
}

export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
