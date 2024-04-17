import Product from '@database/models/product'
import { GetAllRequestQuery } from '@src/types/sales.types'
import { findQueryGenerators } from '@src/utils/generators'
import { IncludeOptions, WhereOptions } from 'sequelize'

export default class ProductServices {
  static DEFAULT_VARIATION_INCLUDE: IncludeOptions = {
    association: 'variations',
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId'] },
  }
  static DEFAULT_STORES_INCLUDE: IncludeOptions = {
    association: 'stores',
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId'] },
    include: [{ association: 'store', attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } }],
  }
  static DEFAULT_INCLUDES: IncludeOptions[] = [this.DEFAULT_VARIATION_INCLUDE, this.DEFAULT_STORES_INCLUDE]

  // get all products
  static async getAllProducts(queryData?: GetAllRequestQuery, where?: WhereOptions, includes?: IncludeOptions[]) {
    const include: IncludeOptions[] = [this.DEFAULT_VARIATION_INCLUDE, ...(includes ?? [])]

    const { count, rows } = await Product.findAndCountAll(
      findQueryGenerators(Product.getAttributes(), queryData, { where, include })
    )

    return { total: count, products: rows }
  }

  // get one product by id
  static async getProductByPk(id: string) {
    return await Product.findByPk(id, {
      include: this.DEFAULT_INCLUDES,
    })
  }

  // get one product
  static async getOneProduct(where?: WhereOptions, include?: IncludeOptions[]) {
    return await Product.findOne({
      where,
      include: [...this.DEFAULT_INCLUDES, ...(include ?? [])],
    })
  }

  // update product
  static async updateProduct(id: string, data: any) {
    const { name, image, description } = data
    const product = await Product.findOne({
      where: { id },
      include: [this.DEFAULT_VARIATION_INCLUDE],
    })
    if (!product) throw new Error('Product not found')

    name && (product.name = name)
    image && (product.image = image)
    description && (product.description = description)

    return await product.save()
  }

  // create new product
  static async createNewProduct(data: any) {
    return await Product.create(data, {
      include: [this.DEFAULT_VARIATION_INCLUDE],
    })
  }
}
