import { Options, Sequelize } from "sequelize";
import config from "./config/config";
import dotenv from 'dotenv';

dotenv.config();

let sequelizeConnection: Sequelize = new Sequelize((config as { [key: string]: Options })[process.env.NODE_ENV || 'development']);

export default sequelizeConnection;



