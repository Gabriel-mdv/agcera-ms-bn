import { type Association, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize'
import User from './user'
import sequelize from '@database/connection'

class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
  declare id: string |null;
  declare name: string;
  declare phone: string;
  declare location: string ;
  declare isOpen: boolean |null;
  declare readonly createdAt: Date |null;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;
  declare static associations: {
    users: Association<Model<any, any>, Model<any, any>>;
  }
}

Store.init({
  id: {
    unique: true,
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  phone: DataTypes.STRING,
  isOpen: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Store',
  tableName: 'Stores'
});

Store.hasMany(User, {
  foreignKey: 'storeId',
  as: 'users',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

export default Store;
