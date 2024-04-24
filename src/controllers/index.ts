import { NextFunction, Request, Response } from 'express';

export class BaseController {
  // This is a base class for all controllers. It contains common methods that are used by all controllers.
  // Here we are wrapping every method of the class that extends this BaseController with a try-catch block.
  constructor() {
    return new Proxy(this, {
      get: function (target: any, propKey: string, receiver: ProxyConstructor) {
        const originalMethod = target[propKey];
        if (typeof originalMethod === 'function') {
          return async (req: Request, res: Response, next: NextFunction, ...args: any) => {
            try {
              return await originalMethod.apply(this, [req, res, next, ...args]);
            } catch (error) {
              console.error(`An error in ${target?.name}`, error);
              return res.status(500).json({
                status: 'fail',
                message: 'An unexpected error occurred. Please try again later.',
              });
            }
          };
        } else {
          return Reflect.get(target, propKey, receiver);
        }
      },
    });
  }
}
