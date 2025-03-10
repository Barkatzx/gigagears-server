import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwtUtils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return; // Stop execution
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded; // Attach user to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
