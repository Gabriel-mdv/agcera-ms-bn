import { Association, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./user";
import sequelize from "@database/connection";
import Product from "./product";

class Varitation extends Model<InferAttributes<Varitation>, InferCreationAttributes<Varitation>> {
  declare id: String |null;
  declare name: String;
  declare description: String | null;
  declare costPrice: Number;
  declare sellingPrice: Number;
  declare readonly createdAt: Date;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;
  declare productId: ForeignKey<Product['id']>;
  
}

  Varitation.init({
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    costPrice: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL,
    productId: DataTypes.UUID,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Varitation',
    tableName: 'Variations'
  });


  export default Varitation;