import express from 'express';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors);
app.use(express.json());

// routes will be added here;

const PORT = process.env.PORT || 5000;

//  as soon as you are connected, then
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`server is running on https://localhost:${PORT}`));
    })
    .catch((err) => console.log(`MongoDB connection error:`, err));

    //  we'll add the rest later