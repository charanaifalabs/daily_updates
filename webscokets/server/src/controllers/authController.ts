import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const data = await registerUser(username, email, password);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getuser = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
