import { Request, Response } from 'express';
import Shop from '../../database/models/shop'
import { shopSchema } from '../validation/shopShema';


class ShopsController {
    static async createShop(req: Request, res: Response): Promise<Response | undefined> {     
        try {
            const {error, value} = shopSchema.validate(req.body);
            if(error) {
                return res.status(400).json({
                    status: 'fail',
                    message: error.message
                });
            }

            const {name, location, phone, isActive} = value;

            const shop = await Shop.create({name, location, phone, isActive});

            if(!shop) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Failed to create shop'
                });
            }

            return res.status(201).json({
                status: 'success',
                data: shop
            });
            
        
        } catch (e: any) {
            return res.status(500).json({
                status: 'fail',
                message: e.message
            });
        }
    }
}

export default ShopsController;