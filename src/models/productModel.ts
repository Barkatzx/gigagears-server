import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  categories: string[];
  photo: string;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  categories: {
    type: [String],
    required: [true, "At least one category is required"],
    validate: {
      validator: (value: string[]) => value.length > 0,
      message: "At least one category is required",
    },
  },
  photo: {
    type: String,
    required: [true, "Product photo URL is required"],
    match: [/^https?:\/\/.+/, "Invalid URL format"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = model<IProduct>("Product", productSchema);
