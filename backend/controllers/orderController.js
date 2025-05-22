const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      address,
      paymentType,
      cardName,
      cardNumber,
      expiry,
      cvv
    } = req.body;
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!productId || !address || !paymentType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = new Order({
      userId: req.user.userId,
      product: {
        id: product._id,
        name: product.productName,
        price: product.sellingPrice,
        image: product.imageUrls[0]
      },
      address,
      paymentType,
      paymentDetails: paymentType !== 'cash' ? {
        cardName,
        cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
        expiry
      } : null,
      orderTime: new Date()
    });

    await order.save();

    return res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') 
      .sort({ orderTime: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};