import { Router } from "express";
import { sendMessage, fetchMessages } from "../controllers/messageController";

const router = Router();

router.post("/", sendMessage);
router.get("/:user1/:user2", fetchMessages);

export default router;
