import ProductServices from '@src/services/product.services'
import VariationServices from '@src/services/variation.services'
import { RequestWithUser } from '@src/types/common.types'
import { ProductTypesEnum } from '@src/types/product.types'
import { GetAllRequestQuery } from '@src/types/sales.types'
import { UserRolesEnum } from '@src/types/user.types'
import { handleDeleteUpload, handleUpload } from '@src/utils/cloudinary'
import { formatSortQuery } from '@src/utils/formatters'
import { validateGetAllRequestQuery, validateUUIDV4 } from '@src/validation/common.validation'
import { validateCreateNewProduct, validateUpdateProduct } from '@src/validation/products.validation'
import { UploadApiErrorResponse } from 'cloudinary'
import { Request, Response } from 'express'
import { IncludeOptions, Op } from 'sequelize'

export default class ProductsController {
  // get all products
  static async getAllProducts(
    req: RequestWithUser<object, object, object, GetAllRequestQuery<string>>,
    res: Response
  ): Promise<Response> {
    const { search, limit, skip, sort } = req.query

    let formattedSort: GetAllRequestQuery['sort']
    try {
      if (sort) formattedSort = formatSortQuery(sort)
    } catch (e: any) {
      return res.status(400).json({
        status: 400,
        message: e.message,
      })
    }

    const { error, value } = validateGetAllRequestQuery({ search, limit, skip, sort: formattedSort })
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      })
    }

    const { products, total } = await ProductServices.getAllProducts(value)

    return res.status(200).json({
      status: 'success',
      data: { products, total },
    })
  }

  // get one product
  static async getOneProduct(req: RequestWithUser, res: Response): Promise<Response> {
    const { role: userRole, id: userId } = req.user!

    const { error, value } = validateUUIDV4(req.params.id)
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      })
    }
    const { id } = value

    const include: IncludeOptions[] = []

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
      })
    }

    const product = await ProductServices.getOneProduct({ id }, include)
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      status: 'success',
      data: product,
    })
  }

  // Create product
  static async createNewProduct(req: Request, res: Response): Promise<Response> {
    // validate the request body
    const { error, value } = validateCreateNewProduct(req.body)
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      })
    }
    const { name, type, description, variations } = value

    // Restrict standard products to have only one variation
    if (type === ProductTypesEnum.STANDARD && variations.length > 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Standard products should only have one variation which is the default variation',
      })
    }

    // Check if there exist a product with the same name as the one supplied
    const foundProduct = await ProductServices.getOneProduct({ name })
    if (foundProduct) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product with the provided name already exists',
      })
    }

    let url: string | null = null
    if (req.file) {
      try {
        url = await handleUpload(req.file, 'products')
      } catch (error) {
        return res.status(400).json({
          status: 'fail',
          message: (error as UploadApiErrorResponse).message || 'Failed while uploading the product image',
        })
      }
    }

    // create the product
    const product = await ProductServices.createNewProduct({ name, type, image: url, description })
    if (variations?.length > 0) {
      // Create variations
      await VariationServices.addManyVariations(product.id, variations)
      // Reload the product to get the variations created
      await product.reload()
    }

    return res.status(201).json({
      status: 'success',
      data: product,
    })
  }

  // update product
  static async updateProduct(req: RequestWithUser, res: Response): Promise<Response> {
    const user = req.user!

    const { error: paramError, value: paramValue } = validateUUIDV4(req.params.id)
    if (paramError) {
      return res.status(400).json({
        status: 'fail',
        message: paramError.message,
      })
    }
    const { id } = paramValue

    const { error, value } = validateUpdateProduct(req.body)
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      })
    }
    const { name, variations } = value

    const include: IncludeOptions[] = [
      {
        association: 'stores',
        required: true,
        include: [
          {
            association: 'store',
            required: true,
            include: [
              {
                association: 'users',
                where: { id: user.id },
                required: true,
              },
            ],
          },
        ],
      },
    ]
    const previousProduct = await ProductServices.getOneProduct({ id }, include)
    // check permission of the user for the action
    if (user.role !== UserRolesEnum.ADMIN && !previousProduct) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to perform this action or the product does not exist',
      })
    }
    if (!previousProduct) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      })
    }
    // Restrict standard products to have only one variation
    if (
      previousProduct.type === ProductTypesEnum.STANDARD &&
      (variations.length > 1 || (variations.length === 1 && previousProduct.variations![0].name !== variations[0].name))
    ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Standard products should only have one default variation',
      })
    }

    // Check if there exist a product with the same name as the one supplied
    const foundProduct = name && (await ProductServices.getOneProduct({ name: name, id: { [Op.not]: id } }))
    if (foundProduct) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product with the provided name already exists',
      })
    }

    let url: string | null = null
    if (req.file) {
      try {
        url = await handleUpload(req.file, 'products')
      } catch (error) {
        return res.status(400).json({
          status: 'fail',
          message: (error as UploadApiErrorResponse).message || 'Failed while uploading the product image',
        })
      }
    }

    // update the product
    const product = await ProductServices.updateProduct(id, { ...value, image: url })
    // delete the old image on cloud
    if (url)
      // No need to bother catching the error as the image is already updated
      handleDeleteUpload(previousProduct.image).catch((error) => {
        console.error('Failed to delete the old image', error)
      })
    // update or create variations
    for (const variation of variations ?? []) {
      await VariationServices.updateOrCreateManyVariations(product.id, variation)
    }
    // Reload the product to get the new variations
    await product.reload()

    return res.status(200).json({
      status: 'success',
      data: product,
    })
  }

  // delete product
  static async deleteProduct(req: RequestWithUser, res: Response): Promise<Response> {
    const { error, value } = validateUUIDV4(req.params.id)
    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
      })
    }
    const { id } = value

    const product = await ProductServices.getProductByPk(id)
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      })
    }

    await product.destroy()

    return res.status(201).json({
      status: 'success',
      data: 'Product deleted successfully',
    })
  }
}
