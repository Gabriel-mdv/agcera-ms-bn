import sequelize from '@database/connection'
import {
  DataTypes,
  NonAttribute,
  type Association,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from 'sequelize'
import StoreProduct from './storeproduct'
import User from './user'

class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
  declare id: string | null
  declare name: string
  declare phone: string
  declare location: string
  declare isActive: boolean | null
  declare readonly createdAt: Date | null
  declare updatedAt: Date | null
  declare deletedAt: Date | null

  declare users?: NonAttribute<User[]>
  declare products?: NonAttribute<StoreProduct[]>

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
    name: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
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
    modelName: 'Store',
    tableName: 'Stores',
    paranoid: true,
  }
)

Store.hasMany(User, {
  foreignKey: 'storeId',
  as: 'users',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
User.belongsTo(Store, { foreignKey: 'storeId', as: 'store' })

export default Store
