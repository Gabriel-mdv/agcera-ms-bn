import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
  req.body = value;
  return next();
};
