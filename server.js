import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // must include .js
import foodRoutes from "./routes/foodRoutes.js";
import { verifyFirebaseToken } from "./middleware/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/foods", foodRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
