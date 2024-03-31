import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, Association } from "sequelize";
import { User } from './user';

export class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
  declare id: String |null;
  declare name: String;
  declare phone: String;
  declare location: String ;
  declare isOpen: Boolean |null;
  declare readonly createdAt: Date |null;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;

  declare static associations: {
    users: Association<Model<any, any>, Model<any, any>>;
  };
}

export default (sequelize: Sequelize) => {

  Shop.hasMany(User, {
    foreignKey: 'shopId',
    as: 'users',
  })

  Shop.init({
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
  }, {
    sequelize,
    modelName: 'Shop',
    tableName: 'shops'
  });

  return Shop;
}
