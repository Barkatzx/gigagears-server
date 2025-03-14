import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwtUtils";

// Define custom interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    // Verify token and get decoded payload
    const decoded = verifyToken(token);

    // Ensure decoded payload has expected structure
    if (!(decoded && (decoded as any).id)) {
      throw new Error("Invalid token payload");
    }

    // Properly attach user ID to request object
    req.user = {
      _id: (decoded as any).id, // Use the correct field from your JWT payload
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
    return; // Explicit return after error response
  }
};
