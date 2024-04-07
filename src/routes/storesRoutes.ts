import { Router } from "express";
import ShopsController from "../controllers/storesController";
const {createStore, getStores, singleStore, updateStore, deleteStore} = ShopsController;

const router = Router();
router.post('/', createStore)
router.get('/all', getStores)
router.get('/:id', singleStore)
router.patch('/:id', updateStore)
router.delete('/:id', deleteStore)


export default router;