const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.getSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    // Count users and sellers separately
    const totalUsers = await User.countDocuments({ accountType: "User" });
    const totalSellers = await User.countDocuments({ accountType: "Seller" });

    const orders = await Order.find({});

    const totalSales = orders.reduce((sum, order) => {
      const orderTotal = order.products.reduce((orderSum, prod) => {
        return orderSum + prod.price * prod.quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);

    // Get rating info
    const allProducts = await Product.find({}, "ratingAverage reviews");
    const ratingSum = allProducts.reduce(
      (sum, product) => sum + (product.ratingAverage || 0),
      0
    );
    const averageRating = allProducts.length
      ? +(ratingSum / allProducts.length).toFixed(2)
      : 0;

    // Calculate total reviews by summing length of reviews array on each product
    const totalReviews = allProducts.reduce(
      (sum, product) => sum + (product.reviews?.length || 0),
      0
    );

    res.status(200).json({
      totalProducts,
      totalUsers,
      totalSellers,
      totalSales,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
