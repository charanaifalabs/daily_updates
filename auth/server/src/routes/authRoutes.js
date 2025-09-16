import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);

export default router;
