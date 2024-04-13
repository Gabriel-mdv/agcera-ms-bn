import {
  type Association,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize'
import User from './user'
import sequelize from '@database/connection'
import StoreProduct from './storeproduct'

class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
  declare id: string | null
  declare name: string
  declare phone: string
  declare location: string
  declare isOpen: boolean | null
  declare readonly createdAt: Date | null
  declare updatedAt: Date | null
  declare deletedAt: Date | null

  declare products?: NonAttribute<StoreProduct[]>
  declare users?: NonAttribute<User[]>

  declare static associations: {
    users: Association<User, Store>
  }
}

Store.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    phone: DataTypes.STRING,
    isOpen: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    modelName: 'Store',
    tableName: 'Stores',
  }
)

Store.hasMany(User, {
  foreignKey: 'storeId',
  as: 'users',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default Store
