import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // User is attached to the request by authMiddleware

  if (user.role === "admin") {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
};

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user.role === "customer") {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied. Customer role required." });
  }
};
