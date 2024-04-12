import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize'
import Sale from './sale'
import sequelize from '@database/connection'
import Product from './product'

class SaleProduct extends Model<InferAttributes<SaleProduct>, InferCreationAttributes<SaleProduct>> {
  declare readonly id: string | undefined

  declare saleId: ForeignKey<Sale['id']>
  declare productId: ForeignKey<Product['id']>

  declare quantity: number | undefined

  declare readonly createdAt: Date | undefined
  declare updatedAt: Date | undefined
  declare deletedAt: Date | undefined
}
SaleProduct.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    saleId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Sales',
        key: 'id',
      },
    },
    productId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'SaleProduct',
    tableName: 'SaleProducts',
  }
)

SaleProduct.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale',
})
SaleProduct.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

export default SaleProduct
