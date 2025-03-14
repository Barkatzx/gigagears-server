import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().max(500).required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  photo: Joi.string().uri().required(),
});

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((err) => err.message),
    });
  }
  next();
};
