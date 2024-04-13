import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { userRegisterSchema, userLoginSchema, userUpdateSchema, emailSchema } from '../validation/user.validation'
import { generateToken, verifyToken } from '../utils/jwtFunctions'
import { Op, WhereOptions } from 'sequelize'
import sendEmail from '../utils/sendEmail'
import userService from '../services/user.services'
import StoreServices from '@src/services/store.services'
import { RequestWithUser } from '@src/types/common.types'

class UsersController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      //  validate the body using joi
      const { error } = userRegisterSchema.validate(req.body)

      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: error.message,
        })
      }

      const { name, email, phone, password, storeId, gender, location, role } = req.body

      // Check if user already exists and was not deleted before
      const user = await userService.getOneUser({ [Op.or]: [{ email }, { phone }] })
      if (user && user.deletedAt === null) {
        let message = ''
        if (user.email === email) {
          message = 'Another user with this email already exists.'
        } else if (user.phone === phone) {
          message = 'Another user with this phone number already exists.'
        }

        return res.status(400).json({
          status: 'fail',
          message,
        })
      }

      // Check store exists
      const store = await StoreServices.getStoreById(storeId)
      if (!store) {
        return res.status(400).json({
          status: 'fail',
          message: 'No Store found with the provided storeId.',
        })
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10))

      // check if the user already exists
      const newUser = await userService.registerUser(
        name,
        hashedPassword,
        email,
        phone,
        gender,
        location,
        storeId,
        role
      )

      // generate token for the user
      const token = generateToken({ id: newUser.id, role: newUser.role })
      // store the token in the cookies
      res.cookie('AuthToken', token, { httpOnly: true, secure: true, sameSite: 'none' })

      // return the new user
      return res.status(200).json({
        status: 'success',
        data: newUser,
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // login the user
  static async Login(req: Request, res: Response): Promise<Response | undefined> {
    try {
      // validate the body using joi
      const { error } = userLoginSchema.validate(req.body)

      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: error.message,
        })
      }

      const { phone, password } = req.body

      // check if the user exists and login the user
      const user = await userService.loginUser(phone)

      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid credentials',
        })
      }

      // compare the password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid credentials',
        })
      }

      // generate the toke for the user
      const token = generateToken({ id: user.id, role: user.role })
      // store the token in the cookies
      res.cookie('AuthToken', token, { httpOnly: true, secure: true, sameSite: 'none' })

      delete (user.dataValues as { [key: string]: any }).password

      return res.status(200).json({
        status: 'success',
        data: user,
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // logout the user
  static async Logout(req: Request, res: Response): Promise<Response> {
    try {
      // clear the cookies
      res.clearCookie('AuthToken')

      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // forgot password
  static async ForgotPasword(req: Request, res: Response): Promise<Response> {
    try {
      // validate the phone number
      const { error } = emailSchema.validate(req.body)

      const email = req.body.email

      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: error.message,
        })
      }

      // check the user exists
      const user = await userService.getOneUser({ email })

      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User with the provided email not found',
        })
      }

      // generate the token
      const token = generateToken({ id: user.id })

      // send the token to the user's email
      await sendEmail(
        email,
        'Password Reset',
        `Please follow the link to reset the password http://localhost:4000/api/v1/users/reset/${token}, the token expires in 24 hours.`
      )

      // send the token to the user's phone number
      return res.status(200).json({
        status: 'success',
        message: 'An email with instructions to reset your password has been sent to your email.',
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // reset password
  static async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      // get the token from  params
      const { token } = req.params
      const password = req.body.password

      // verify the token
      const decoded_token = verifyToken(token)
      if (!decoded_token) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid token',
        })
      }

      const { id }: { [key: string]: any } = decoded_token

      // get the user using the id
      const user = await userService.getUserById(id)

      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User assigned to this token not found',
        })
      }

      // hash the new password
      if (!password) {
        return res.status(400).json({
          status: 'fail',
          message: 'New Password is required',
        })
      }

      const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10))

      // update the password
      user.password = hashedPassword
      await user.save()

      return res.status(200).json({
        status: 'success',
        message: 'Password reset successfully',
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // get all users
  static async getAllUsers(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const user = req.user!

      const where: WhereOptions = {}

      if (user.role === 'keeper') {
        where['storeId'] = user.storeId
      }

      const users = await userService.getAllUsers({ where })

      return res.status(200).json({
        status: 'success',
        data: users,
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // get single user profile
  static async getSingleUser(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const user = req.user!

      const foundUser = await userService.getUserById(id)

      if (user.role === 'user' && user.id !== id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You can only request your account',
        })
      } else if (user.role === 'keeper' && user.storeId !== foundUser?.storeId) {
        return res.status(403).json({
          status: 'fail',
          message: 'You are not authorized to view this user account or user does not exist',
        })
      }

      if (!foundUser) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        })
      }

      return res.status(200).json({
        status: 'success',
        data: foundUser,
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // update user profile
  static async updateUser(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params

      const user = await userService.getUserById(id)
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        })
      }

      // update the user
      const { error, value } = userUpdateSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: error.message,
        })
      }

      const { name, email, phone, storeId } = value

      name ? (user.name = name) : null
      email ? (user.email = email) : null
      phone ? (user.phone = phone) : null
      storeId ? (user.storeId = storeId) : null

      await user.save()

      delete (user.dataValues as { [key: string]: any }).password

      return res.status(200).json({
        status: 'success',
        data: user,
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }

  // delete user
  static async deleteUser(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const user = req.user!
      const { id } = req.params

      if (user.id === id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You cannot delete yourself, ask another admin to delete your account',
        })
      }

      const foundUser = await userService.getUserById(id)
      if (!foundUser) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        })
      }

      // delete the user
      await foundUser.destroy()

      return res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      })
    } catch (e: any) {
      console.log('Unexpected Error ===> ', e)
      return res.status(500).json({
        status: 'fail',
        message: 'An unexpected error occured, please try again later.',
      })
    }
  }
}

export default UsersController
