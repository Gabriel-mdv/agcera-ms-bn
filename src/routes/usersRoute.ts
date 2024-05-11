import { validate, validateParams } from '@src/middlewares/validation';
import {
  emailSchema,
  passwordSchema,
  userLoginSchema,
  userRegisterSchema,
  userUpdateSchema,
} from '@src/validation/user.validation';
import { Router } from 'express';
import UsersController from '../controllers/usersController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '../middlewares/checkAuth';

const router: Router = Router();
const usersController = new UsersController();

router.post('/register', isAdmin, validate(userRegisterSchema), usersController.register);
router.post('/login', validate(userLoginSchema), usersController.Login);
router.post('/forgot', validate(emailSchema), usersController.ForgotPasword);
router.put('/reset/:token', validate(passwordSchema), usersController.resetPassword);
router.post('/logout', usersController.Logout);

router.get('/', isStoreKeeperUp, usersController.getAllUsers);
router.get('/me', isLoggedIn, usersController.getProfile);
router.get('/:id', isLoggedIn, validateParams(), usersController.getSingleUser);
router.patch('/:id', isAdmin, validateParams(), validate(userUpdateSchema), usersController.updateUser);
router.delete('/:id', isAdmin, validateParams(), usersController.deleteUser);

export default router;
