import { Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {userRegisterSchema, userLoginSchema, phoneSchema} from '../validation/userSchema';
import { generateToken, verifyToken } from '../utils/jwtFunctions';
import { UniqueConstraintError, where } from 'sequelize';
import sendEmail from '../utils/sendEmail';
import { decode } from 'punycode';
import User from '@database/models/user';

class UsersController {

    static async register(req: Request, res: Response): Promise<Response | undefined> {
        try {

            //  validate the body using joi
            const { error, value } = userRegisterSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    status: 'fail',
                    message: error.message
                });
            }

            const {name , email, phone, password} = value;
            const {gender, location, role} = req.body;

            // hash the password
            const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10))

            // check if the user already exists
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                phone,
                gender,
                location,
                role
            });

            if(!newUser) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Failed to create user'

                })
            }

            // generate token for the user
            const token = generateToken({id: newUser.id, role: newUser.role});
            // store the token in the cookies
            res.cookie('AuthToken', token, {httpOnly: true, secure: true, sameSite: 'none'});

            // return the new user
            return res.status(200).json({
                status: 'success',
                data: newUser
            });

        } catch (e:any) {
            if(e instanceof UniqueConstraintError) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'User already exists'
                });
            }else{
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
         }
        }
    }

    // login the user
    static async Login(req: Request, res: Response): Promise<Response | undefined> {
        try {

            // validate the body using joi
            const {error, value} = userLoginSchema.validate(req.body);

            if(error){
                return res.status(400).json({
                    status: 'fail',
                    message: error.message
                });
            }

            const {phone, password} = value;

            // check if the user exists and login the user
            const user = await User.findOne({where: {phone}});
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'User not found'
                });
            }

            // compare the password using bcrypt
            const isMatch = await bcrypt.compare(password, user.password as string)

            if(!isMatch){
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid credentials'
                });
            }

            // generate the toke for the user
            const token = generateToken({id: user.id, role: user.role});
            // store the token in the cookies
            res.cookie('AuthToken', token, {httpOnly: true, secure: true, sameSite: 'none'});

            delete (user.dataValues as {[key: string]: any}).password;

            return res.status(200).json({
                status: 'success',
                data: user
            })
        }

        catch(e: any){
            return res.status(500).json({
                status: 'fail',
                message: e.message
            })
        }
    }


    // logout the user
    static async Logout(req: Request, res: Response): Promise<Response | undefined> {
        try {

            // clear the cookies
            res.clearCookie('AuthToken');

            return res.status(200).json({
                status: 'success',
                message: 'Logged out successfully'
            });

        } catch (e: any) {
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
        }
    }

    // forgot password
    static async ForgotPasword(req: Request, res: Response): Promise<Response | undefined> {
        try {
            // validate the phone number
            const {error, value} = phoneSchema.validate(req.body);

            const phone = value.phone
            console.log(phone)

            if (error) {
                return res.status(400).json({
                    status: 'fail',
                    message:error.message
                });
            }

            // check if the user exists
            const user = await User.findOne({where: {phone}});
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'User not found'
                });
            }

            // generate the token
            const token = generateToken({id: user.id});

            // check if the use has email
            if(! user.email){
                return res.status(400).json({
                    status: 'fail',
                    message: 'Please contact the admin to reset your password'
                });
            }

            // send the token to the user's email
            const sent_mail = await sendEmail(user.email as string, 'Password Reset',
            `Please follow the link to reset the password http://localhost:4000/api/v1/users/reset/${token}`);

            if(!sent_mail){
                return res.status(500).json({
                    status: 'fail',
                    message: 'Failed to send the email with token. Please try again!'
                });
            }

            // send the token to the user's phone number
            return res.status(200).json({
                status: 'success',
                message: 'Token sent to your Email'
            });

        } catch (e: any) {
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
        }
    }

    // reset password
    static async resetPassword (req: Request, res: Response): Promise<Response | undefined> {
        try{
            // get the token from  params
            const { token } = req.params;

            // verify the token
            const decoded_token = verifyToken(token);
            if(!decoded_token){
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid token'
                });
            }

            const {id} = decoded_token as {[key: string]: object};

            // get the user using the id
            const user = await User.findOne({ where: {id} });

            console.log(user)

            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'User not found'
                });
            }

            // hash the new password
            if(!req.body.password){
                return res.status(400).json({
                    status: 'fail',
                    message: 'New Password is required'
                });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));

            // update the password
            user.password = hashedPassword;
            await user.save();

            return res.status(200).json({
                status: 'success',
                message: 'Password reset successfully'
            });

        }
        catch(e: any){
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
        }
    }

    // get all users
    static async getAllUsers(req: Request, res: Response): Promise<Response | undefined> {
        try {
            const users = await User.findAll();

            return res.status(200).json({
                status: 'success',
                data: users
            });

        } catch (e: any) {
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
        }
    }

    // get single user profile
    static async getSingleUser(req: Request, res: Response): Promise<Response | undefined> {
        try {
            const {id} = req.params;

            const user = await User.findOne({where: {id}});

            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: user
            });

        } catch (e: any) {
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
        }
    }

}

export default UsersController;
