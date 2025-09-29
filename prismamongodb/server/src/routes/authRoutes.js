import express from "express";
import { signup, login, profile } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMIddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, profile);

export default router;
