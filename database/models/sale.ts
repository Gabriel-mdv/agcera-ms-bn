import sequelize from '@database/connection';
import {
  DataTypes,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  NonAttribute,
  CreationOptional,
  Association,
} from 'sequelize';
import User from './user';
import Store from './store';
import { ClientTypesEnum } from '@src/types/user.types';
import SaleProduct from './saleproduct';

export enum PaymentMethodsEnum {
  CASH = 'CASH',
  MOMO = 'MOMO',
}

class Sale extends Model<InferAttributes<Sale>, InferCreationAttributes<Sale>> {
  declare readonly id: CreationOptional<string>;
  declare paymentMethod: PaymentMethodsEnum;

  // The client who made the sale, if he is not registered in the system use a phone number.
  declare clientId: ForeignKey<User['id']> | string;
  declare clientType: ClientTypesEnum;
  declare storeId: ForeignKey<Store['id']>;

  declare store: NonAttribute<Store>;
  declare products: NonAttribute<SaleProduct[]>;

  declare static associations: {
    products: Association<SaleProduct, Sale>;
    store: Association<Sale, Store>;
  };

  declare readonly createdAt: CreationOptional<Date>;
  declare updatedAt: Date | undefined;
  declare deletedAt: Date | undefined;
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
      type: DataTypes.STRING,
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
    paranoid: true,
  }
);

Sale.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
User.hasMany(Sale, { foreignKey: 'clientId', as: 'sales' });

Sale.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.hasMany(Sale, { foreignKey: 'storeId', as: 'sales' });

SaleProduct.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale',
});
Sale.hasMany(SaleProduct, {
  foreignKey: 'saleId',
  as: 'products',
});

export default Sale;
