import { Request, RequestHandler, Response } from "express";
import fs from "fs";
import cloudinary from "../config/cloudinary";
import { Product } from "../models/productModel";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, description, categories } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    console.log("Uploading file to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });
    console.log("Cloudinary Upload Result:", result);

    // Create product with Cloudinary image URL
    const product = new Product({
      name,
      price,
      description,
      categories,
      photo: result.secure_url,
    });

    const createdProduct = await product.save();
    console.log("Created Product:", createdProduct);

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Product creation failed:", error);
    res.status(500).json({ message: "Product creation failed", error });
  }
};

// controllers/productController.ts
export const getAllProducts: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;

    const filter: Record<string, any> = {}; // Use 'any' to allow flexible object structure
    if (category) filter.categories = category;

    if (minPrice || maxPrice) {
      filter.price = {}; // Explicitly define it as an object before adding properties
      if (minPrice)
        (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice)
        (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const sortOptions: Record<string, 1 | -1> = {};
    if (sort === "price_asc") sortOptions.price = 1;
    if (sort === "price_desc") sortOptions.price = -1;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .select("-__v");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};
