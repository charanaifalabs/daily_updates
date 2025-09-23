import { Request, RequestHandler, Response } from "express";
import BookRequest from "../models/BookRequest";
import Book from "../models/Book";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Librarian request (create, update, delete)
export const createBookRequest: RequestHandler = async (
  req: any,
  res: Response
) => {
  try {
    const { title, author, description, publishedYear, price, action, bookId } =
      req.body;

    console.log("Creating book request:", {
      title,
      author,
      action,
      price,
      userId: req.user?.id,
    });

    if (!req.user?.id) {
      console.log("ERROR: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!title || !author || !action) {
      console.log("ERROR: Missing required fields");
      return res
        .status(400)
        .json({ message: "Title, author, and action are required" });
    }

    const request = await BookRequest.create({
      title,
      author,
      description,
      publishedYear,
      price,
      action,
      bookId: action === "update" || action === "delete" ? bookId : undefined,
      requestedBy: req.user.id,
      status: "pending",
    });

    console.log("Book request created successfully:", request._id);
    res.status(201).json(request);
  } catch (error: any) {
    console.error("Error creating book request:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create request" });
  }
};

// List requests
export const getBookRequests: RequestHandler = async (
  req: any,
  res: Response
) => {
  try {
    const role = req.user?.role;
    console.log("Fetching requests for role:", role, "user:", req.user?.id);

    if (role === "admin") {
      const requests = await BookRequest.find()
        .populate("requestedBy", "name email")
        .sort({ createdAt: -1 });
      console.log("Admin found", requests.length, "requests");
      return res.json(requests);
    }
    // default: librarian sees own
    const requests = await BookRequest.find({ requestedBy: req.user.id })
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });
    console.log("Librarian found", requests.length, "requests");
    return res.json(requests);
  } catch (error: any) {
    console.error("Error fetching book requests:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch requests" });
  }
};

// Admin handles request
export const handleBookRequest: RequestHandler = async (
  req: any,
  res: Response
) => {
  try {
    const { status } = req.body;
    const request = await BookRequest.findById(req.params.id);
    if (!request) {
      console.log("Request not found");
      return res.status(404).json({ message: "Request not found" });
    }

    console.log("Found request:", request.action, request.title);

    request.status = status;
    await request.save();

    if (status === "approved") {
      console.log("Approving request with action:", request.action);

      if (request.action === "create") {
        const newBook = await Book.create({
          title: request.title,
          author: request.author,
          description: request.description,
          publishedYear: request.publishedYear,
          price: request.price,
          createdBy: req.user.id,
        });
        console.log("Created new book:", newBook._id);
      } else if (request.action === "update" && request.bookId) {
        const updatedBook = await Book.findByIdAndUpdate(request.bookId, {
          title: request.title,
          author: request.author,
          description: request.description,
          publishedYear: request.publishedYear,
          price: request.price,
        });
        console.log("Updated book:", updatedBook?._id);
      } else if (request.action === "delete" && request.bookId) {
        const deletedBook = await Book.findByIdAndDelete(request.bookId);
        console.log("Deleted book:", deletedBook?._id);
      }
    }

    console.log("Request handled successfully");
    res.json({ message: `Request ${status}`, request });
  } catch (error: any) {
    console.error("Error handling book request:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to handle request" });
  }
};
