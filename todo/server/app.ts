import express, { Application, Request, Response } from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.get("/", (req: Request, res: Response) => res.send("Todo API running"));

export default app;
