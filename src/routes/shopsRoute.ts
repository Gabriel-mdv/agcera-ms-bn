import {Router} from "express";
import ShopsController from "../controllers/shopsController";


const router: Router = Router();

router.get('/', (req, res) => {
    res.send('this the the shop router');
})
router.post('/', ShopsController.createShop)

export default router;







