import { Options, Sequelize, DataTypes } from "sequelize";
import fs from 'fs';
import path from 'path';
import configs from '@database/config/config';


const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = (configs as any)[env];
const db: any = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.js' ||
      file.slice(-3) === '.ts') &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;


