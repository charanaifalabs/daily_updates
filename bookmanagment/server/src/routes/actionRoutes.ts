import { Router } from "express";
import {
  borrowBook,
  returnBook,
  purchaseBook,
  getUserBooks,
} from "../controllers/actionController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post("/:id/borrow", protect, authorizeRoles(["user"]), borrowBook);
router.post("/:id/return", protect, authorizeRoles(["user"]), returnBook);
router.post("/:id/purchase", protect, authorizeRoles(["user"]), purchaseBook);
router.get("/me/list", protect, authorizeRoles(["user"]), getUserBooks);

export default router;
