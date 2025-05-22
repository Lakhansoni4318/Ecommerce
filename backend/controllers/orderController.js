const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/CartModel");
const Watchlist = require("../models/watchlistModel");
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      products,
      address,
      phone,
      paymentType,
      paymentDetails: { cardName, cardNumber, expiry, cvv } = {},
    } = req.body;
    
    if (!req.user || !req.user.userId) {
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
        return res.status(400).json({ message: "Missing card payment details" });
      }
    }

    let orderProducts = [];

    for (const item of products) {
      const { id: productId, quantity = 1 } = item;  // <-- changed here
      const product = await Product.findById(productId).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      if (quantity > product.stock) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Requested quantity (${quantity}) exceeds available stock for product ${product.productName}`,
        });
      }

      orderProducts.push({
        id: product._id,
        name: product.productName,
        price: product.sellingPrice,
        image: product.imageUrls[0],
        quantity,
      });

      // Deduct stock
      product.stock -= quantity;
      await product.save({ session });
    }

    const order = new Order({
      userId: req.user.userId,
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

    // Remove products from Cart & Watchlist
    const cart = await Cart.findOne({ userId: req.user.userId }).session(session);
    const watchlist = await Watchlist.findOne({ userId: req.user.userId }).session(session);

    for (const item of products) {
      const productIdStr = item.id.toString();  // <-- changed here
      if (cart) {
        cart.products = cart.products.filter(
          (p) => p.productId.toString() !== productIdStr
        );
      }
      if (watchlist) {
        watchlist.products = watchlist.products.filter(
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

    if (watchlist) {
      if (watchlist.products.length === 0) {
        await Watchlist.deleteOne({ _id: watchlist._id }).session(session);
      } else {
        await watchlist.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
