require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DEV_DB_USERNAME || "postgres",
    "password": process.env.DEV_DB_PASSWORD || "",
    "database": process.env.DEV_DB_NAME || "agcera",
    "host": process.env.DEV_DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.PROD_DB_USERNAME || "postgres",
    "password": process.env.PROD_DB_PASSWORD || "",
    "database": process.env.PROD_DB_NAME || "agcera",
    "host": process.env.PROD_DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  }
};
