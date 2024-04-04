import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./user";
import sequelize from "@database/connection";

class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
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
  sequelize: sequelize,
  modelName: 'Shop',
  tableName: 'shops'
});

Shop.hasMany(User, {
  foreignKey: 'shopId',
  as: 'users',
})

export default Shop;
