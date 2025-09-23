import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export const signToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as string | JwtPayload;
};
