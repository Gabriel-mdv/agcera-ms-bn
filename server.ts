import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Express from 'express';
import morgan from 'morgan';
import sequelize from './database/connection';
import router from './src/routes';
import { globalErrorHandler } from '@src/utils/errors';

dotenv.config();
const app = Express();

// All app configuration
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.send('welcome to agcera, got to /api/v1 to access the latest API documentation');
});
app.use('/api/v1', router);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

sequelize
  .authenticate()
  .then(() => {
    console.log('database connected successfully');
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
