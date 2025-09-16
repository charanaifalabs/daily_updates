import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: false,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Auth API running" });
});

app.use("/api/auth", authRoutes);

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () =>
    console.log(`Server listening on ${PORT}`)
  );
});
