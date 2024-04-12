import sequelize from '@database/connection'
import { DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize'
import { ClientType } from './user'
import type User from './user'
import type Shop from './shop'

export enum PaymentMethod {
  CASH = 'CASH',
  MOMO = 'MOMO',
}

class Sale extends Model<InferAttributes<Sale>, InferCreationAttributes<Sale>> {
  declare readonly id: string | undefined

  // The client who made the sale, if he is not registered in the system use a phone number.
  declare clientId: ForeignKey<User['id']> | string
  declare clientType: ClientType
  declare shopId: ForeignKey<Shop['id']>

  declare paymentMethod: PaymentMethod

  declare readonly createdAt: Date | undefined
  declare updatedAt: Date | undefined
  declare deletedAt: Date | undefined
}

Sale.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    paymentMethod: {
      allowNull: false,
      type: DataTypes.ENUM(PaymentMethod.CASH, PaymentMethod.MOMO),
      defaultValue: PaymentMethod.MOMO,
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
      type: DataTypes.ENUM(ClientType.USER, ClientType.CLIENT),
      defaultValue: ClientType.USER,
    },
    shopId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Shops',
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
    modelName: 'sale',
    tableName: 'Sales',
  }
)

export default Sale
