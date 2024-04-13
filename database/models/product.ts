import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'
import Store from './user'
import Varitation from './varitation'
import sequelize from '@database/connection'
import { ProductTypesEnum } from '@src/types/product.types'

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: string | null
  declare name: string
  declare description: string | null
  declare type: ProductTypesEnum

  declare variations?: NonAttribute<Varitation[]>
  declare stores?: NonAttribute<Store[]>

  declare static associations: {
    variations: Association<Varitation, Product>
    stores: Association<Product, Store>
  }

  declare readonly createdAt: Date
  declare updatedAt: Date | null
  declare deletedAt: Date | null
}

Product.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ProductTypesEnum)),
      allowNull: false,
      defaultValue: ProductTypesEnum.STANDARD,
    },
    description: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    modelName: 'Product',
    tableName: 'Products',
  }
)

Product.hasMany(Varitation, {
  foreignKey: 'productId',
  as: 'variations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default Product
