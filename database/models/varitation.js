'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Varitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Varitation.init({
    name: DataTypes.STRING,
    costPrice: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Varitation',
  });
  return Varitation;
};