import sequelize from '@database/connection'
import { InferAttributes, InferCreationAttributes, Model, DataTypes, ForeignKey } from 'sequelize'
import Product from './product'
import Store from './store'

class StoreProduct extends Model<InferAttributes<StoreProduct>, InferCreationAttributes<StoreProduct>> {
  declare id: string
  declare quantity: number

  declare storeId: ForeignKey<Store['id']>
  declare productId: ForeignKey<Product['id']>

  declare readonly createdAt: Date
  declare updatedAt: Date | null
  declare deletedAt: Date | null
}

StoreProduct.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      },
    },
    storeId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Stores',
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
    sequelize: sequelize,
    modelName: 'StoreProduct',
    tableName: 'StoreProducts',
  }
)

StoreProduct.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
StoreProduct.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'stores',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default StoreProduct