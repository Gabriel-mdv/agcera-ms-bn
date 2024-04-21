import sequelize from '@database/connection';
import { ProductTypesEnum } from '@src/types/product.types';
import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import Store from './user';
import Variation from './variation';
import SaleProduct from './saleproduct';
import StoreProduct from './storeproduct';

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare type: ProductTypesEnum;
  declare image: CreationOptional<string>;
  declare description: string | null;

  declare variations: NonAttribute<Variation[]>;
  declare stores?: NonAttribute<StoreProduct[]>;
  declare sales?: NonAttribute<SaleProduct[]>;

  declare static associations: {
    variations: Association<Variation, Product>;
    stores: Association<StoreProduct, Store>;
    sales: Association<SaleProduct, Product>;
  };

  declare readonly createdAt: CreationOptional<Date>;
  declare updatedAt: Date | null;
  declare deletedAt: Date | null;
}

Product.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://via.placeholder.com/150?text=image%20not%20found',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ProductTypesEnum)),
      allowNull: false,
      defaultValue: ProductTypesEnum.STANDARD,
    },
    description: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    modelName: 'Product',
    tableName: 'Products',
    paranoid: true,
  }
);

Product.hasMany(Variation, {
  foreignKey: 'productId',
  as: 'variations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Variation.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

export default Product;
