import { Router } from "express";
import usersController from "../controllers/usersController";
import { isAdmin } from "../middlewares/checkAuth";


const router: Router = Router();

router.post('/register', usersController.register);
router.post('/login', usersController.Login);
router.post('/forgot', usersController.ForgotPasword);
router.get('/logout', usersController.Logout);
router.get('/all', isAdmin, usersController.getAllUsers);
router.put('/reset/:token', usersController.resetPassword);

export default router;