require('dotenv').config();

console.log(process.env.NODE_ENV)
console.log(process.env.DEV_DB_NAME)

module.exports = {
  "development": {
    "username": process.env.DEV_DB_USERNAME,
    "password": process.env.DEV_DB_PASSWORD,
    "database": process.env.DEV_DB_NAME,
    "host": process.env.DEV_DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.PROD_DB_USERNAME,
    "password": process.env.PROD_DB_PASSWORD,
    "database": process.env.PROD_DB_NAME,
    "host": process.env.PROD_DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  }
};
