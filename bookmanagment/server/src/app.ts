import express from "express";
import cors from "cors";
import "express-async-errors";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import bookRequestRoutes from "./routes/bookRequestRoutes";
import errorHandler from "./middleware/errorHandler";
import actionRoutes from "./routes/actionRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/book-requests", bookRequestRoutes);
app.use("/api/action", actionRoutes);

app.use(errorHandler);

export default app;
