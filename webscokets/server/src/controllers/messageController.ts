import { Request, Response } from "express";
import { saveMessage, getMessages } from "../services/messageService";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, content } = req.body;
    const message = await saveMessage(sender, receiver, content);
    res.json(message);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await getMessages(user1, user2);
    res.json(messages);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
