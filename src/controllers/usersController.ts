import StoreServices from '@src/services/store.services';
import { ExtendedRequest } from '@src/types/common.types';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import userService from '../services/user.services';
import { /* defaultTokenExpirySeconds,*/ generateToken, verifyToken } from '../utils/jwtFunctions';
import sendEmail from '../utils/sendEmail';
import { BaseController } from '.';

class UsersController extends BaseController {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email = null, phone, password, storeId, gender, location, role } = req.body;

    // Check if user already exists and was not deleted before
    const user = await userService.getOneUser({ [Op.or]: [{ email }, { phone }] });
    if (user) {
      let message = '';
      if (user.email === email) {
        message = 'Another user with this email already exists.';
      } else if (user.phone === phone) {
        message = 'Another user with this phone number already exists.';
      }

      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    // Check store exists
    const store = await StoreServices.getStoreById(storeId);
    if (!store) {
      return res.status(400).json({
        status: 'fail',
        message: 'No Store found with the provided storeId.',
      });
    }
    if (role === 'admin' && store.name !== 'main') {
      return res.status(400).json({
        status: 'fail',
        message: 'An admin can only be registered in the main store.',
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    // check if the user already exists
    const newUser = await userService.registerUser(name, hashedPassword, email, phone, gender, location, storeId, role);

    // generate token for the user
    const token = generateToken({ id: newUser.id, role: newUser.role });
    // store the token in the cookies
    res.cookie('AuthToken', token, { httpOnly: true, secure: true, sameSite: 'none' });

    // return the new user
    return res.status(200).json({
      status: 'success',
      data: newUser,
    });
  }

  // login the user
  async Login(req: Request, res: Response): Promise<Response> {
    const { phone, password } = req.body;

    // check if the user exists and login the user
    const user = await userService.loginUser(phone);

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // generate the toke for the user
    const tokenDuration = 7 * 24 * 60 * 60;
    const token = generateToken({ id: user.id, role: user.role, expiresIn: tokenDuration });
    // store the token in the cookies
    // multiply by 1000 to convert to milliseconds as the expiresIn is in seconds
    res.cookie('AuthToken', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenDuration * 1000 });
    res.cookie('AuthTokenExists', true, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: tokenDuration * 1000,
    });

    delete (user.dataValues as { [key: string]: any }).password;

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  }

  // logout the user
  async Logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie('AuthToken');
    res.clearCookie('AuthTokenExists');

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }

  // forgot password
  async ForgotPasword(req: Request, res: Response): Promise<Response> {
    const email = req.body.email;

    // check the user exists
    const user = await userService.getOneUser({ email });

    if (user) {
      // If no user found do nothing, this is to prevent information leakage about our user emails 😝
      // generate the token
      const token = generateToken({ id: user.id }, 15 * 60 * 60);

      // send the token to the user's email
      const emailSent = await sendEmail(
        email,
        'Password Reset',
        `Follow the link below to reset your password:\n${process.env.FRONTEND_URL}/${process.env.FRONTEND_RESET_PATH || '/rest-password'}/${token}\n\nThis link will expire in 15 minutes.`
      );

      if (!emailSent) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error sending email. Please try again later.',
        });
      }
    }

    // send the token to the user's phone number
    return res.status(200).json({
      status: 'success',
      message: 'An email with instructions to reset your password has been sent to your email.',
    });
  }

  // reset password
  async resetPassword(req: Request, res: Response): Promise<Response> {
    // get the token from  params
    const { token } = req.params;
    const password = req.body.password;

    // verify the token
    const decoded_token = verifyToken(token);
    if (!decoded_token) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid token',
      });
    }

    const { id }: { [key: string]: any } = decoded_token;

    // get the user using the id
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User assigned to this token not found',
      });
    }

    // hash the new password
    if (!password) {
      return res.status(400).json({
        status: 'fail',
        message: 'New Password is required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    // update the password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  }

  // get all users
  async getAllUsers(req: ExtendedRequest, res: Response): Promise<Response> {
    const user = req.user!;
    const { search, limit, skip, sort } = req.query;

    const where: WhereOptions = {};
    if (user.role === 'keeper') {
      where['storeId'] = user.storeId;
    }

    const { users, total } = await userService.getAllUsers({ search, limit, skip, sort }, where);

    return res.status(200).json({
      status: 'success',
      data: { users, total },
    });
  }

  // get single user profile
  async getSingleUser(req: ExtendedRequest, res: Response): Promise<Response> {
    const user = req.user!;
    const { id } = req.params;

    const foundUser = await userService.getUserById(id);

    if (user.role === 'user' && user.id !== id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only request your account',
      });
    } else if (user.role === 'keeper' && user.storeId !== foundUser?.storeId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to view this user account or user does not exist',
      });
    }

    if (!foundUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: foundUser,
    });
  }

  // get logged in user profile
  async getProfile(req: ExtendedRequest, res: Response): Promise<Response> {
    const user = req.user!;

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  }

  // update user profile
  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, email, phone, storeId } = req.body;

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Check store exists
    const store = await StoreServices.getStoreById(storeId);
    if (!store) {
      return res.status(400).json({
        status: 'fail',
        message: 'No Store found with the provided storeId.',
      });
    }
    if (user.role === 'admin' && store.name !== 'main') {
      return res.status(400).json({
        status: 'fail',
        message: 'An admin can only be registered in the main store.',
      });
    }

    name ? (user.name = name) : null;
    email ? (user.email = email) : null;
    phone ? (user.phone = phone) : null;
    storeId ? (user.storeId = storeId) : null;

    await user.save();

    delete (user.dataValues as { [key: string]: any }).password;

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  }

  // delete user
  async deleteUser(req: ExtendedRequest, res: Response): Promise<Response> {
    const user = req.user!;
    const { id } = req.params;

    if (user.id === id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You cannot delete yourself, ask another admin to delete your account',
      });
    }

    const foundUser = await userService.getUserById(id);
    if (!foundUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // delete the user
    await foundUser.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  }
}

export default UsersController;
