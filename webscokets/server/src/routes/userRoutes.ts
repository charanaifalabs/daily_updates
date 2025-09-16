import express from "express";
import { getuser } from "../controllers/authController";

const router = express.Router();

router.get("/", getuser);

export default router;
