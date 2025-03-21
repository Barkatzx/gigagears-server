import { Request, Response } from "express";
import Stripe from "stripe";

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia", // Use the correct API version
});

const supportedCurrencies = ["usd", "eur", "gbp"]; // Add more as needed

export const createPaymentIntent = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, currency = "usd" } = req.body;

    console.log("Incoming Request Body:", req.body); // Debugging

    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      res.status(400).json({ error: "Valid amount is required" });
      return;
    }

    // Validate currency
    if (!supportedCurrencies.includes(currency.toLowerCase())) {
      res.status(400).json({ error: "Unsupported currency" });
      return;
    }

    // Convert amount to cents (Stripe expects amounts in the smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user?.id || "anonymous", // Example: Add user ID
        orderId: "order_123", // Example: Add order ID
      },
    });

    console.log("Generated clientSecret:", paymentIntent.client_secret); // Debugging

    // Return success response
    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (err) {
    // Log and return error response
    console.error("Payment intent error:", err);

    // Provide a detailed error message
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";

    res.status(500).json({
      success: false,
      message: "Error creating payment intent",
      error: errorMessage,
    });
  }
};
