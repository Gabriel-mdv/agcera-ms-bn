import User from '@database/models/user';
import { NextFunction, Response } from 'express';
import { verifyToken } from '../utils/jwtFunctions';

const checkRoleMiddleware =  (requiredRole: string) => {
    return  async (req: any, res: Response, next: NextFunction) => {
        // Extract the token from cookies
        const token = req.cookies.AuthToken;

        // Check if the token exists
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized. Please Login!' });
        }


        // If the token exists, decode and verify it
        const decoded_token = verifyToken(token)

         // Check if the token is valid
         if (!decoded_token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized. Please Login!' });
        }


        const {id} = decoded_token as {[key: string]: object}

        // Check if the user exists
        if (!id) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized. Please Login as a valid user!' });
        }

        const user = await User.findOne({ where: {id} });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized. Please Login as a valid user!' });
        }

        // if only checking if the user is logged in
        if (requiredRole === '*') {
            req.user = user;
            next();
        }

        // Check if the user has the required role
        if (user.role !== requiredRole) {
            req.user = user;
            return res.status(403).json({
                status: 'fail',
                message: 'Access Forbidden' });
        }

        next();
    };
};


export const isAdmin = checkRoleMiddleware('admin');
export const isStoreKeeper = checkRoleMiddleware('keeper');
export const isCleint = checkRoleMiddleware('client');

// you can also check for any role you wish

// use the same check role to simply check if the user is logged in
export const isLoggedIn = checkRoleMiddleware('*');

