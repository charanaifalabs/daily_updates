import { Router } from "express";
import { register, login, getuser } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", getuser);

export default router;
