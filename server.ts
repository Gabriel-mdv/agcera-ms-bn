import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Express from 'express';
import morgan from 'morgan';
import sequelize from './database/connection';
import router from './src/routes';


const app = Express();


// all app configuration
app.use(morgan('dev'));
dotenv.config();
app.use(bodyParser.json())
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('welcome to agcera');
})
app.use('/api/v1', router);

sequelize.authenticate().then(() => {
    console.log('database connected successfully');
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
})