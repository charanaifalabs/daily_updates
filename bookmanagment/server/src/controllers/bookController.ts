import { Request, Response } from "express";
import Book from "../models/Book";

// Create
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, description, publishedYear, price } = req.body;
    const userId = (req as any).user?.id;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const existing = await Book.findOne({ title, author });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Book with this title and author already exists" });
    }

    const book = new Book({
      title,
      author,
      description,
      publishedYear,
      price,
      createdBy: userId,
    });

    await book.save();
    res.status(201).json(book);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get by id
export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publishedYear } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (title && author) {
      const existing = await Book.findOne({
        title,
        author,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res
          .status(409)
          .json({ message: "Another book with this title and author exists" });
      }
    }

    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
