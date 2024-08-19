import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes';
const app = express();


app.use('/files', express.static(path.join(__dirname, '..','/files')));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
);
app.use('/',router)

export default app;