import { Router } from "express";
import {
  getBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

//admin, librarian, user
router.get(
  "/",
  protect,
  authorizeRoles(["admin", "librarian", "user"]),
  getBooks
);
router.get(
  "/:id",
  protect,
  authorizeRoles(["admin", "librarian", "user"]),
  getBook
);

// Only admin
router.post("/", protect, authorizeRoles(["admin"]), createBook);
router.put("/:id", protect, authorizeRoles(["admin"]), updateBook);
router.delete("/:id", protect, authorizeRoles(["admin"]), deleteBook);

export default router;
