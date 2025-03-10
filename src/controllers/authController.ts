import { Request, Response } from "express";
import { User } from "../models/userModel";
import { generateToken } from "../utils/jwtUtils";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return; // Stop execution
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return; // Stop execution
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.json({ message: "Logged out successfully" });
};
