import Message, { IMessage } from "../models/Message";

export const saveMessage = async (
  sender: string,
  receiver: string,
  content: string
): Promise<IMessage> => {
  return await Message.create({ sender, receiver, content });
};

export const getMessages = async (
  user1: string,
  user2: string
): Promise<IMessage[]> => {
  return await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort({ timestamp: 1 });
};
