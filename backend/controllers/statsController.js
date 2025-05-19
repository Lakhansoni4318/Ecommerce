const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.getSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "User" });

    const orders = await Order.find({}).populate("product", "price");

    const totalSales = orders.reduce((sum, order) => {
      return sum + (order.product ? order.product.price : 0);
    }, 0);

    const allRatings = await Product.find({}, "ratingAverage");
    const ratingSum = allRatings.reduce((sum, product) => sum + (product.ratingAverage || 0), 0);
    
    // Keep averageRating as number rounded to 2 decimals or 0 if no ratings
    const averageRating = allRatings.length ? +(ratingSum / allRatings.length).toFixed(2) : 0;

    res.status(200).json({
      totalProducts,
      totalSales,
      totalCustomers,
      averageRating,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
