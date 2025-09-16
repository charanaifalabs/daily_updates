import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/jwt";

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  const token = generateToken(user.id);

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user.id);
  return { user, token };
};
