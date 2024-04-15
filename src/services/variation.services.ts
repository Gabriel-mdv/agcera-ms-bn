import Variation from '@database/models/variation'
import ProductServices from './product.services'

export default class VariationServices {
  static async addManyVariations(productId: string, variations: any[]) {
    // Add variations
    return Variation.bulkCreate(variations.map((variation: any) => ({ ...variation, productId })))
  }

  static async updateOrCreateManyVariations(productId: string, data: any): Promise<Variation | undefined> {
    // update or create variation
    const product = await ProductServices.getProductByPk(productId)
    if (!product) return

    const { name, costPrice, sellingPrice, description } = data

    const variations: Variation[] = product['variations'] ?? []
    let variation: Variation | undefined = variations.find((v) => v.name === name)

    if (variation) {
      costPrice && (variation.costPrice = costPrice)
      sellingPrice && (variation.sellingPrice = sellingPrice)
      description && (variation.description = description)
      await variation.save()
    } else {
      variation = await Variation.create({ ...data, productId })
    }

    return variation
  }
}
