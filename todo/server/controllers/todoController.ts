import { Request, Response } from "express";
import Todo, { ITodo } from "../models/Todo";

// GET all todos
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos: ITodo[] = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET todo by ID
export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "Invalid Todo ID" });
      return;
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.status(200).json(todo);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a new todo
export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const todo = new Todo({
      title: title.trim(),
      description,
      completed: !!completed,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE a todo
export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!id || id.length !== 24) {
      res.status(400).json({ message: "Invalid Todo ID" });
      return;
    }

    if (title && title.trim() === "") {
      res.status(400).json({ message: "Title cannot be empty" });
      return;
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      { title: title?.trim(), description, completed },
      { new: true }
    );

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json(todo);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a todo
export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      res.status(400).json({ message: "Invalid Todo ID" });
      return;
    }

    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};
