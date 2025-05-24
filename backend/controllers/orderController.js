const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/CartModel");
const Wishlist = require("../models/watchlistModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let transactionCommitted = false;

  try {
    const {
      products,
      address,
      phone,
      email,
      paymentType,
      paymentDetails: { cardName, cardNumber, expiry, cvv } = {},
    } = req.body;
    const userId = req.user?.userId;
    const userEmail = email;

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !address ||
      !paymentType
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (paymentType !== "cash") {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "Missing card payment details" });
      }
    }

    let orderProducts = [];

    for (const item of products) {
      const { id: productId, quantity = 1 } = item;
      const product = await Product.findById(productId).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ message: `Product not found: ${productId}` });
      }

      if (quantity > product.stock) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Requested quantity exceeds available stock for ${product.productName}`,
        });
      }

      orderProducts.push({
        id: product._id,
        name: product.productName,
        price: product.sellingPrice,
        image: product.imageUrls[0],
        quantity,
      });

      await Product.updateOne(
        { _id: productId },
        { $inc: { stock: -quantity } },
        { session }
      );
    }

    const order = new Order({
      userId,
      products: orderProducts,
      address,
      phone,
      paymentType,
      paymentDetails:
        paymentType !== "cash"
          ? {
              cardName,
              cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
              expiry,
            }
          : null,
      orderTime: new Date(),
    });

    await order.save({ session });

    // Remove items from cart and wishlist
    const cart = await Cart.findOne({ userId }).session(session);
    const wishlist = await Wishlist.findOne({ userId }).session(session);

    for (const item of products) {
      const productIdStr = item.id.toString();
      if (cart) {
        cart.products = cart.products.filter(
          (p) => p.productId.toString() !== productIdStr
        );
      }
      if (wishlist) {
        wishlist.products = wishlist.products.filter(
          (p) => p.productId.toString() !== productIdStr
        );
      }
    }

    if (cart) {
      if (cart.products.length === 0) {
        await Cart.deleteOne({ _id: cart._id }).session(session);
      } else {
        await cart.save({ session });
      }
    }

    if (wishlist) {
      if (wishlist.products.length === 0) {
        await Wishlist.deleteOne({ _id: wishlist._id }).session(session);
      } else {
        await wishlist.save({ session });
      }
    }

    await session.commitTransaction();
    transactionCommitted = true;
    session.endSession();

    // Send email (async - does not affect response)
    if (userEmail) {
      const productListHtml = orderProducts
        .map(
          (prod) =>
            `<li>${prod.name} - Quantity: ${prod.quantity} - Price: ₹${prod.price}</li>`
        )
        .join("");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Your Order Has Been Placed Successfully!",
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Your order has been placed successfully.</p>
          <h3>Order Details:</h3>
          <ul>${productListHtml}</ul>
          <p><strong>Delivery Address:</strong> ${address}</p>
          <p><strong>Contact Phone:</strong> ${phone}</p>
          <p><strong>Payment Method:</strong> ${paymentType}</p>
          <p>We will notify you once your order is shipped.</p>
          <br />
          <p>Best regards,<br />Your Company Name</p>
        `,
      };

    }

    return res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    if (!transactionCommitted) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("Order error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ orderTime: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
