import { Request, Response } from "express";
import Book from "../models/Book";
import Borrow from "../models/Borrow";
import Purchase from "../models/Purchase";

// Borrow
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const userId = (req as any).user.id;
    const { borrowedAt } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    if (book.status !== "available") {
      return res
        .status(400)
        .json({ success: false, message: "Book not available" });
    }

    book.status = "borrowed";
    await book.save();

    const borrow = new Borrow({
      user: userId,
      book: book._id,
      borrowedAt: borrowedAt ? new Date(borrowedAt) : new Date(),
    });

    await borrow.save();

    res.json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Return
export const returnBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const userId = (req as any).user.id;
    const { returnedAt } = req.body;

    const borrow = await Borrow.findOne({
      book: bookId,
      user: userId,
      status: "borrowed",
    });
    if (!borrow) {
      return res
        .status(404)
        .json({ success: false, message: "Borrow record not found" });
    }

    borrow.status = "returned";
    borrow.returnedAt = returnedAt ? new Date(returnedAt) : new Date();
    await borrow.save();

    const book = await Book.findById(bookId);
    if (book) {
      book.status = "available";
      await book.save();
    }

    res.json({
      success: true,
      message: "Book returned successfully",
      data: borrow,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Purchase
export const purchaseBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const userId = (req as any).user.id;
    const { price } = req.body;

    const book = await Book.findById(bookId);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    if (book.status === "sold")
      return res
        .status(400)
        .json({ success: false, message: "Book already sold" });

    book.status = "sold";
    await book.save();

    const purchase = new Purchase({ user: userId, book: book._id, price });
    await purchase.save();

    res.json({
      success: true,
      message: "Book purchased successfully",
      data: purchase,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get users borrowed and purchased books
export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Only get currently borrowed books (not returned)
    const borrowed = await Borrow.find({
      user: userId,
      status: "borrowed",
    }).populate("book");
    const purchased = await Purchase.find({ user: userId }).populate("book");

    res.json({ success: true, data: { borrowed, purchased } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
