import Express from 'express';
import dotenv from 'dotenv';
import sequelizeConnection from './database/connection';

const app = Express();


dotenv.config();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('welcome to agcera');
})


sequelizeConnection.authenticate().then(() => {
    console.log('database connected successfully');
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
})