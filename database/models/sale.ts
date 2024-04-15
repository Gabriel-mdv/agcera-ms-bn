import sequelize from '@database/connection'
import {
  DataTypes,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  NonAttribute,
  CreationOptional,
} from 'sequelize'
import User from './user'
import Store from './store'
import { ClientTypesEnum } from '@src/types/user.types'

export enum PaymentMethodsEnum {
  CASH = 'CASH',
  MOMO = 'MOMO',
}

class Sale extends Model<InferAttributes<Sale>, InferCreationAttributes<Sale>> {
  declare readonly id: string | undefined

  // The client who made the sale, if he is not registered in the system use a phone number.
  declare clientId: ForeignKey<User['id']> | string
  declare clientType: ClientTypesEnum
  declare storeId: ForeignKey<Store['id']>

  declare paymentMethod: PaymentMethodsEnum

  declare readonly client: NonAttribute<User> | undefined
  declare readonly store: NonAttribute<Store>

  declare readonly createdAt: CreationOptional<Date>
  declare updatedAt: Date | undefined
  declare deletedAt: Date | undefined
}

Sale.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    paymentMethod: {
      allowNull: false,
      type: DataTypes.ENUM(PaymentMethodsEnum.CASH, PaymentMethodsEnum.MOMO),
      defaultValue: PaymentMethodsEnum.MOMO,
    },
    clientId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    clientType: {
      allowNull: false,
      type: DataTypes.ENUM(ClientTypesEnum.USER, ClientTypesEnum.CLIENT),
      defaultValue: ClientTypesEnum.USER,
    },
    storeId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Stores',
        key: 'id',
      },
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
    sequelize,
    modelName: 'sale',
    tableName: 'Sales',
  }
)

Sale.belongsTo(User, { foreignKey: 'clientId', as: 'client' })
Sale.belongsTo(Store, { foreignKey: 'storeId', as: 'store' })

export default Sale
