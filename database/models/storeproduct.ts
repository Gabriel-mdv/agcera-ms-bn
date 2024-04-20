import sequelize from '@database/connection';
import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import Product from './product';
import Store from './store';

class StoreProduct extends Model<InferAttributes<StoreProduct>, InferCreationAttributes<StoreProduct>> {
  declare id: CreationOptional<string>;
  declare quantity: number;

  declare storeId: ForeignKey<Store['id']>;
  declare productId: ForeignKey<Product['id']>;

  declare store?: NonAttribute<Store>;
  declare product?: NonAttribute<Product>;

  declare static associations: {
    store: Association<StoreProduct, Store>;
    product: Association<StoreProduct, Product>;
  };

  declare readonly createdAt: CreationOptional<Date>;
  declare updatedAt: Date | null;
  declare deletedAt: Date | null;
}

StoreProduct.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      },
    },
    storeId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Stores',
        key: 'id',
      },
    },
    productId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Products',
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
    sequelize: sequelize,
    modelName: 'StoreProduct',
    tableName: 'StoreProducts',
  }
);

StoreProduct.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.hasMany(StoreProduct, {
  foreignKey: 'productId',
  as: 'stores',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default StoreProduct;
