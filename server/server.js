import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test route (general testing)
app.get("/", (req, res) => {
  res.send("🚀 API is working");
  console.log("Route Working");
});

// auth routes
app.use("/api/auth", authRoutes);

// transaction routes
app.use("/api/transactions", transactionRoutes);




// App listening process below here:
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server is running at http://localhost:${PORT}`));
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
