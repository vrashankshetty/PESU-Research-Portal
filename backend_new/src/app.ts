import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import errorHandler from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';
import routes from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        credentials: true,
        origin: [`${process.env.IP}:8081`,`${process.env.IP}:8080`,`${process.env.IP}:9001`,'http://localhost:3000','http://localhost:3001'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
);
app.use(errorHandler);
// app.use(rateLimiter);

app.use('/api/v1', routes);
export default app;
