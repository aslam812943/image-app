import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js'

import cookieParser from 'cookie-parser';
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});