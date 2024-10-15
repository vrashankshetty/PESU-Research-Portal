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
const allowedOrigins = ['http://localhost:3000', 'http://10.2.80.90:8081', 'http://10.2.80.90:8080'];

app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
);
app.use(errorHandler);
app.use(rateLimiter);

app.use('/api/v1', routes);
export default app;
