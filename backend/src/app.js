import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user/user.routes.js';

const app = express();
// Registering all middelwares 
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
))
app.use(cookieParser());

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// Setting up routes 

app.use('/api/v1/user', userRouter);

export default app;