import sequelize from '@database/connection'
import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import Product from './product'

class Varitation extends Model<InferAttributes<Varitation>, InferCreationAttributes<Varitation>> {
  declare id: string | null
  declare name: string
  declare description: string | null
  declare costPrice: number
  declare sellingPrice: number
  declare readonly createdAt: Date
  declare updatedAt: Date | null
  declare deletedAt: Date | null
  declare productId: ForeignKey<Product['id']>
}

Varitation.init(
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
    costPrice: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL,
    productId: DataTypes.UUID,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Varitation',
    tableName: 'Variations',
  }
)

export default Varitation
