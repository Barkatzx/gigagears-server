// controllers/orderController.ts
import { Request, Response } from "express";
import { Order } from "../models/ordersModel"; // Adjust path as needed

// Create a new order
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
//Get All Orders
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // If no orders are found, return a 404 response
    if (!orders || orders.length === 0) {
      res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Return the orders in the response
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    // Handle any errors that occur during the database query
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};
// Approve an order
export const approveOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "approved" },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Decline an order
export const declineOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "declined" },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
