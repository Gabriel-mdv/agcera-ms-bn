import { validate, validateParams } from '@src/middlewares/validation';
import { emailSchema, userLoginSchema, userRegisterSchema, userUpdateSchema } from '@src/validation/user.validation';
import { Router } from 'express';
import UsersController from '../controllers/usersController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '../middlewares/checkAuth';

const router: Router = Router();
const usersController = new UsersController();

router.post('/register', validate(userRegisterSchema), usersController.register);
router.post('/login', validate(userLoginSchema), usersController.Login);
router.post('/forgot', validate(emailSchema), usersController.ForgotPasword);
router.post('/logout', usersController.Logout);
router.put('/reset/:token', usersController.resetPassword);

router.get('/', isStoreKeeperUp, usersController.getAllUsers);
router.get('/:id', isLoggedIn, validateParams(), usersController.getSingleUser);
router.patch('/', isAdmin, validate(userUpdateSchema), usersController.updateUser);
router.delete('/:id', isAdmin, validateParams(), usersController.deleteUser);

export default router;
