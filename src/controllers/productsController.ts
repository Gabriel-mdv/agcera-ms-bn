import ProductServices from '@src/services/product.services';
import VariationServices from '@src/services/variation.services';
import { ExtendedRequest } from '@src/types/common.types';
import { ProductTypesEnum } from '@src/types/product.types';
import { UserRolesEnum } from '@src/types/user.types';
import { handleDeleteUpload, handleUpload } from '@src/utils/cloudinary';
import { UploadApiErrorResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { IncludeOptions, Op } from 'sequelize';
import { BaseController } from '.';

export default class ProductsController extends BaseController {
  // get all products
  async getAllProducts(req: ExtendedRequest, res: Response): Promise<Response> {
    const { search, limit, skip, sort } = req.query;

    const { products, total } = await ProductServices.getAllProducts({ search, limit, skip, sort });

    return res.status(200).json({
      status: 'success',
      data: { products, total },
    });
  }

  // get one product
  async getOneProduct(req: ExtendedRequest, res: Response): Promise<Response> {
    const { role: userRole, id: userId } = req.user!;
    const { id } = req.params;

    const include: IncludeOptions[] = [];

    if ([UserRolesEnum.USER, UserRolesEnum.KEEPER].includes(userRole)) {
      // This will make sure that the user can't see the store and other user account associated with the product
      include.push({
        association: 'stores',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId'] },
        include: [
          {
            association: 'store',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            required: true,
            include: [
              {
                association: 'users',
                where: { id: userId },
                attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
                required: true,
              },
            ],
          },
        ],
      });
    }

    const product = await ProductServices.getOneProduct({ id }, include);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: product,
    });
  }

  // Create product
  async createNewProduct(req: Request, res: Response): Promise<Response> {
    const { name, type, variations } = req.body;

    // Restrict standard products to have only one variation
    if (type === ProductTypesEnum.STANDARD && variations.length > 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Standard products should only have one variation which is the default variation',
      });
    }

    // Check if there exist a product with the same name as the one supplied
    const foundProduct = await ProductServices.getOneProduct({ name });
    if (foundProduct) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product with the provided name already exists',
      });
    }

    let url: string | null = null;
    if (req.file) {
      try {
        url = await handleUpload(req.file, 'products');
      } catch (error) {
        return res.status(400).json({
          status: 'fail',
          message: (error as UploadApiErrorResponse).message || 'Failed while uploading the product image',
        });
      }
    }

    // create the product
    const product = await ProductServices.createNewProduct({ name, type, image: url });
    if (variations?.length > 0) {
      // Create variations
      await VariationServices.addManyVariations(product.id, variations);
      // Reload the product to get the variations created
      await product.reload();
    }

    return res.status(201).json({
      status: 'success',
      data: product,
    });
  }

  // update product
  async updateProduct(req: ExtendedRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, variations } = req.body;

    const previousProduct = await ProductServices.getOneProduct({ id });
    if (!previousProduct) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }
    // Restrict standard products to have only one variation
    if (
      previousProduct.type === ProductTypesEnum.STANDARD &&
      (variations?.length > 1 || previousProduct.variations![0].name !== variations[0].name)
    ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Standard products should only have one default variation',
      });
    }

    // Check if there exist a product with the same name as the one supplied
    const foundProduct = name && (await ProductServices.getOneProduct({ name: name, id: { [Op.not]: id } }));
    if (foundProduct) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product with the provided name already exists',
      });
    }

    let url: string | null = null;
    if (req.file) {
      try {
        url = await handleUpload(req.file, 'products');
      } catch (error) {
        return res.status(400).json({
          status: 'fail',
          message: (error as UploadApiErrorResponse).message || 'Failed while uploading the product image',
        });
      }
    }

    // update the product
    const product = await ProductServices.updateProduct(id, { ...req.body, image: url });
    // delete the old image on cloud
    if (url)
      // No need to bother catching the error as the image is already updated
      handleDeleteUpload(previousProduct.image).catch((error) => {
        console.error('Failed to delete the old image', error);
      });
    // update or create variations
    for (const variation of variations ?? []) {
      await VariationServices.updateOrCreateVariation(product.id, variation);
    }
    // Reload the product to get the new variations
    await product.reload();

    return res.status(200).json({
      status: 'success',
      data: product,
    });
  }

  // delete product
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const product = await ProductServices.getProductByPk(id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    await product.destroy();

    return res.status(201).json({
      status: 'success',
      data: 'Product deleted successfully',
    });
  }

  // get all variations of a product
  async getAllVariations(req: ExtendedRequest, res: Response): Promise<Response> {
    const { productId } = req.params;

    const variations = await VariationServices.getAllVariations(productId);

    return res.status(200).json({
      status: 'success',
      data: variations,
    });
  }

  // delete variation
  async deleteVariation(req: ExtendedRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const product = req.product!;

    const variations = product['variations']!;
    const variation = variations.find((v) => v.id === id);

    if (!variation) {
      return res.status(404).json({
        status: 'fail',
        message: `variation with id ${id}, not found`,
      });
    }
    if (variations.length <= 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product should have atleast one variation',
      });
    }

    await variation.destroy();

    return res.status(200).json({
      status: 'success',
      data: 'Variation deleted successfully',
    });
  }
}
