import { Association, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Store from "./user";
import sequelize from "@database/connection";
import Varitation from "./varitation";

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: String |null;
  declare name: String;
  declare description: String | null;
  declare price: Number;
  declare qt_in_stock: Number;
  declare type: String;
  declare costPrice: Number;
  declare sellingPrice: Number;
  declare storeId: ForeignKey<Store['id']> | null;
  declare readonly createdAt: Date;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;
}


  Product.init({
    id:{
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    qt_in_stock: DataTypes.INTEGER,
    type: DataTypes.STRING,
    costPrice: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL,
    storeId: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products'
  });

  Product.hasMany(Varitation, {
    foreignKey: 'productId',
    as: 'variations',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })


  export default Product;
