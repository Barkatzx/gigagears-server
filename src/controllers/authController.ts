import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
import fs from "fs";
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
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
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
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All User Profile
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile By Id
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};
// Get user profile
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id; // Get user ID from authenticated request
    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Stop execution
    }

    // Send user profile data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server errorx" });
  }
};

// User Profile Picture Upload System
export const profilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    console.log("User ID from request:", userId);

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Check if user exists BEFORE updating
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in database!");
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Upload to Cloudinary
    console.log("Uploading file to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });
    console.log("Cloudinary Upload Result:", result);

    // Update user photo in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { photo: result.secure_url } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log("User update failed!");
      res.status(500).json({ message: "Failed to update user photo" });
      return;
    }

    console.log("Updated User:", updatedUser);

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Photo uploaded successfully",
      url: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
