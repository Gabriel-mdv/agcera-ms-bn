import { type Options, Sequelize } from 'sequelize';
import config from './config/config';
import dotenv from 'dotenv';

dotenv.config();

const sequelize: Sequelize = new Sequelize((config as Record<string, Options>)[process.env.NODE_ENV ?? 'development']);

export default sequelize;
