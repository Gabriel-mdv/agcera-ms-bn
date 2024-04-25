import User from '@database/models/user';
import { Request, type NextFunction, type Response } from 'express';
import { verifyToken } from '../utils/jwtFunctions';
import { ExtendedRequest } from '@src/types/common.types';

const checkRoleMiddleware =
  (requiredRole: string | Array<string>) => async (req: Request, res: Response, next: NextFunction) => {
    // Extract the token from cookies
    const token = req.cookies.AuthToken;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. Please Login!',
      });
    }

    // If the token exists, decode and verify it
    const decoded_token = verifyToken(token);

    // Check if the token is valid
    if (!decoded_token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid Token supplied! Please Login again!',
      });
    }

    const { id } = decoded_token as Record<string, Record<string, unknown>>;

    // Check if the user exists
    if (!id) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid Token supplied! Please Login again!',
      });
    }

    const user = await User.findOne({ where: { id } });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. Please Login!',
      });
    }

    // If only checking if the user is logged in
    if (requiredRole === '*') {
      (req as ExtendedRequest).user = user;
      return next();
    }

    // Check if the user has the required role
    if (Array.isArray(requiredRole) ? requiredRole.includes(user.role) : user.role === requiredRole) {
      (req as ExtendedRequest).user = user;
      return next();
    }

    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to perform this action',
    });
  };

export const isAdmin = checkRoleMiddleware('admin');
export const isStoreKeeper = checkRoleMiddleware('keeper');
export const isUser = checkRoleMiddleware('user');

// You can also check for any role you wish

// use the same check role to simply check if the user is logged in
export const isLoggedIn = checkRoleMiddleware('*');

// In addition you can check for multiple roles
export const isStoreKeeperUp = checkRoleMiddleware(['keeper', 'admin']);
