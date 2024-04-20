import { Router } from 'express';
import usersController from '../controllers/usersController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '../middlewares/checkAuth';
import { emailSchema, userLoginSchema, userRegisterSchema, userUpdateSchema } from '@src/validation/user.validation';
import { validate } from '@src/middlewares/validation';

const router: Router = Router();

router.post('/register', validate(userRegisterSchema), usersController.register);
router.post('/login', validate(userLoginSchema), usersController.Login);
router.post('/forgot', validate(emailSchema), usersController.ForgotPasword);
router.post('/logout', usersController.Logout);
router.put('/reset/:token', usersController.resetPassword);

router.get('/', isStoreKeeperUp, usersController.getAllUsers);
router.get('/:id', isLoggedIn, usersController.getSingleUser);
router.patch('/', isAdmin, validate(userUpdateSchema), usersController.updateUser);
router.delete('/:id', isAdmin, usersController.deleteUser);

export default router;
