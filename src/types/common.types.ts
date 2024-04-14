import User from '@database/models/user'
import { Request } from 'express'
import * as core from 'express-serve-static-core'

export interface RequestWithUser<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: User
}

export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
