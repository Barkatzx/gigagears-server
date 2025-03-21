// controllers/orderController.ts
import { Request, Response } from "express";
import { Order } from "../models/ordersModel"; // Adjust path as needed

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shippingAddress, orderItems, totalPrice, paymentId } = req.body;

    // Validate required fields
    if (!shippingAddress || !orderItems || !totalPrice || !paymentId) {
      res.status(400).json({
        success: false,
        error:
          "Missing required fields: shippingAddress, orderItems, totalPrice, paymentId",
      });
      return;
    }

    // Create new order
    const order = new Order({
      shippingAddress,
      orderItems,
      totalPrice,
      paymentId,
    });

    // Save to database
    const savedOrder = await order.save();

    // Format response
    res.status(201).json({
      success: true,
      order: {
        id: savedOrder._id,
        status: savedOrder.status,
        totalPrice: savedOrder.totalPrice,
        createdAt: savedOrder.createdAt,
        items: savedOrder.orderItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Could not create order.",
    });
  }
};
