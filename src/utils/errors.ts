import { NextFunction, Response, Request } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    status: 'fail',
    message: 'An Unexpected error occurred. Please try again later.',
  });
};
