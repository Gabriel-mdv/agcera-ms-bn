// import { sequelize } from '@database/models/index';
import sequelize from '@database/connection'
import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import Store from './store'

export enum ClientTypesEnum {
  USER = 'USER',
  CLIENT = 'CLIENT',
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string | null
  declare name: string
  declare password: string
  declare email: string | null
  declare phone: string
  declare gender: string | null
  declare location: string
  declare role: string
  declare isActive: boolean | null
  declare readonly createdAt: Date | null
  declare updatedAt: Date | null
  declare deletedAt: Date | null
  declare storeId: ForeignKey<Store['id']>
}

User.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unspecified',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Maputo Center',
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  }
)

export default User
