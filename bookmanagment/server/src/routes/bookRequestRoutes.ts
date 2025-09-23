import { Router } from "express";
import {
  createBookRequest,
  handleBookRequest,
  getBookRequests,
} from "../controllers/bookRequestController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRoles(["librarian", "admin"]),
  createBookRequest
);
router.get(
  "/",
  protect,
  authorizeRoles(["admin", "librarian"]),
  getBookRequests
);
router.put(
  "/:id/handle",
  protect,
  authorizeRoles(["admin"]),
  handleBookRequest
);

export default router;
