import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js'

import cookieParser from 'cookie-parser';
import { HttpStatus } from './constants/HttpStatus.js';
import imageRoutes from './routes/imageRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

connectDB();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use('/uploads', express.static('uploads'));


app.use('/api/user', userRoutes);


app.use('/api/images', imageRoutes);


app.get("/", (req, res) => {
    res.send("Server Running");
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err.message === 'Only images are allowed!') {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});