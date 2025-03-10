import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
const JWT_SECRET = process.env.JWT_SECRET;

// Define the structure of the decoded token
interface DecodedToken {
  id: string;
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration time (timestamp)
}

// Generate a JWT token
export const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
};

// Verify a JWT token
export const verifyToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
