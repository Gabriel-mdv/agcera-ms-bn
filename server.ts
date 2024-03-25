import  Express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sequelizeConnection from './database/connection';
import router from './src/routes';
import cookieParser from 'cookie-parser';


const app = Express();


// all app configuration
dotenv.config();
app.use(bodyParser.json())
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('welcome to agcera');
})
app.use('/api/v1', router);

sequelizeConnection.authenticate().then(() => {
    console.log('database connected successfully');
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
})