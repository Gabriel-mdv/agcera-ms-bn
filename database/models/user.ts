// import { sequelize } from '@database/models/index';
import sequelize from '@database/connection'
import { UserGendersEnum, UserRolesEnum } from '@src/types/user.types'
import {
  // Association,
  DataTypes,
  ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from 'sequelize'
import Store from './store'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string | null
  declare name: string
  declare password: string
  declare phone: string
  declare location: string
  declare role: UserRolesEnum
  declare email: string | null
  declare gender: string | null
  declare isActive: boolean | null

  declare storeId: ForeignKey<Store['id']>

  declare readonly createdAt: Date | null
  declare updatedAt: Date | null
  declare deletedAt: Date | null
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
      validate: {
        min: 4,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(UserGendersEnum)),
      allowNull: false,
      defaultValue: UserGendersEnum.UNSPECIFIED,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Maputo Center',
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRolesEnum)),
      allowNull: false,
      defaultValue: UserRolesEnum.USER,
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'User',
    tableName: 'Users',
    paranoid: true,
  }
)

export default User
