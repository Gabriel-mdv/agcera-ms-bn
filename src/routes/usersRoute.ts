import { Router } from 'express';
import usersController from '../controllers/usersController';
import { isAdmin, isLoggedIn, isStoreKeeperUp } from '../middlewares/checkAuth';

const router: Router = Router();

router.post('/register', usersController.register);
router.post('/login', usersController.Login);
router.post('/forgot', usersController.ForgotPasword);
router.post('/logout', usersController.Logout);
router.put('/reset/:token', usersController.resetPassword);

router.get('/', isStoreKeeperUp, usersController.getAllUsers);
router.get('/:id', isLoggedIn, usersController.getSingleUser);
router.patch('/', isAdmin, usersController.updateUser);
router.delete('/:id', isAdmin, usersController.deleteUser);

export default router;
