// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/foods", foodRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
