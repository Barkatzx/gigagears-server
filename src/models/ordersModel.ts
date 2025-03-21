import mongoose from "mongoose";

interface IOrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  photo: string;
}

interface IOrder extends mongoose.Document {
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  orderItems: IOrderItem[];
  totalPrice: number;
  paymentId: string;
  status: string;
  createdAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  orderItems: [
    {
      product: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      photo: { type: String, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
