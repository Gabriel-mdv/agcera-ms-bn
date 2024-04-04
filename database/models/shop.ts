import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { Sequelize, sequelize } from ".";
import User from "./user";

class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
  declare id: String |null;
  declare name: String;
  declare phone: String;
  declare location: String ;
  declare isActive: Boolean |null;
  declare readonly createdAt: Date |null;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;
}

Shop.hasMany(sequelize.models.User, {
  sourceKey: 'id',
  foreignKey: 'shopId',
  as: 'users' // this determines the name in `associations`!
});

Shop.init({
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
    unique: true
  },
  location: DataTypes.STRING,
  phone: DataTypes.STRING,
  isActive:{
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: new Date()
  },
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'Shop',
  tableName: 'shops'
});

export default Shop;

