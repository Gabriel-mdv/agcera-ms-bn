import User from '@database/models/user';
import { Request } from 'express';
import * as core from 'express-serve-static-core';
import { GetAllRequestQuery } from './sales.types';

export interface ExtendedRequest<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = GetAllRequestQuery>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: User;
}

export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
