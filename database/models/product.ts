import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import Store from './user'
import Varitation from './varitation'
import sequelize from '@database/connection'

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: string | null
  declare name: string
  declare description: string | null
  declare price: number
  declare qt_in_stock: number
  declare type: string
  declare costPrice: number
  declare sellingPrice: number
  declare storeId: ForeignKey<Store['id']> | null
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
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    qt_in_stock: DataTypes.INTEGER,
    type: DataTypes.STRING,
    costPrice: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL,
    storeId: DataTypes.STRING,
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
