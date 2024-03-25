import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { Sequelize, sequelize } from ".";
import User from "./user";


class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
  declare id: String |null;
  declare name: String;
  declare phone: String;
  declare location: String ;
  declare isOpen: Boolean |null;
  declare readonly createdAt: Date |null;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;

  static associate(models: {User: typeof User}) {
    Shop.hasMany(models.User, {
      foreignKey: 'shopId',
      as: 'users'
    });
  }

}

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


Shop.associate({User})


  export default Shop;


