import { Request, RequestHandler, Response } from "express";
import { Product } from "../models/productModel";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, categories, photo } = req.body;

    const product = new Product({
      name,
      price,
      description,
      categories,
      photo,
    });

    const createdProduct = await product.save();

    res.status(201).json({
      _id: createdProduct._id,
      name: createdProduct.name,
      price: createdProduct.price,
      description: createdProduct.description,
      categories: createdProduct.categories,
      photo: createdProduct.photo,
      createdAt: createdProduct.createdAt,
    });
  } catch (error: any) {
    res.status(400).json({
      message:
        error.name === "ValidationError"
          ? Object.values(error.errors).map((err: any) => err.message)
          : "Server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
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
