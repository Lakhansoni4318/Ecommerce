const Product = require("../models/productModel");
const Cart = require("../models/CartModel");
const Watchlist = require("../models/watchlistModel");

exports.addProduct = async (req, res) => {
  const {
    productName,
    productCategory,
    productDescription,
    costPrice,
    sellingPrice,
    stock,
    imageUrls,
  } = req.body;

  try {
    if (
      !productName ||
      !productCategory ||
      !productDescription ||
      !costPrice ||
      !sellingPrice ||
      !stock ||
      !imageUrls ||
      !Array.isArray(imageUrls)
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      productName,
      productCategory,
      productDescription,
      costPrice,
      sellingPrice,
      stock,
      imageUrls,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.allProducts = async (req, res) => {
  const { id, category } = req.body;

  try {
    if (id) {
      if (!id.trim()) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const product = await Product.findById(id).select("-__v");
      if (!product) {
        return res
          .status(404)
          .json({ message: "No product found with the provided ID." });
      }

      return res
        .status(400)
        .json({
          message:
            "To fetch full details, please use the /product-details/:id endpoint.",
        });
    }

    let query = {};
    if (category) {
      query.productCategory = category;
    }

    const products = await Product.find(query).select(
      "costPrice imageUrls productCategory productName sellingPrice stock"
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({
          message: category
            ? `No products found in category "${category}"`
            : "No products available.",
        });
    }

    // Format image to return only the first one
    const formattedProducts = products.map((p) => ({
      _id: p._id,
      costPrice: p.costPrice,
      imageUrl: p.imageUrls?.[0] || "",
      productCategory: p.productCategory,
      productName: p.productName,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
    }));

    return res.status(200).json({
      total: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return res
      .status(500)
      .json({
        message:
          "Server error while fetching products. Please try again later.",
      });
  }
};

exports.productDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!id?.trim()) {
      return res
        .status(400)
        .json({ message: "Product ID is required in the URL." });
    }

    const product = await Product.findById(id).populate(
      "reviews.userId",
      "name email"
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found with the provided ID." });
    }

    const {
      rating = 0,
      ratingCount = 0,
      ratingAverage = 0,
      reviews = [],
    } = product;

    let inCart = false;
    if (userId) {
      const cart = await Cart.findOne({ userId, "products.productId": id });
      inCart = !!cart;
    }

    let inWatchlist = false;
    if (userId) {
      const watchlist = await Watchlist.findOne({
        userId,
        "products.productId": id,
      });
      inWatchlist = !!watchlist;
    }

    return res.status(200).json({
      ...product.toObject(),
      rating,
      ratingCount,
      ratingAverage,
      reviews,
      inCart,
      inWatchlist,
    });
  } catch (error) {
    console.error("Product Details Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while retrieving product details." });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, title, description } = req.body;
    const userId = req.user?.userId; // assuming user is authenticated

    if (!productId || !rating || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: Check if user already reviewed the product to prevent duplicates
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Add new review
    product.reviews.push({
      userId,
      title,
      description,
      rating,
    });

    // Update rating info
    product.ratingCount += 1;
    product.ratingSum += rating;
    product.ratingAverage = +(product.ratingSum / product.ratingCount).toFixed(
      2
    );

    await product.save();

    return res
      .status(201)
      .json({
        message: "Review added successfully",
        ratingAverage: product.ratingAverage,
        ratingCount: product.ratingCount,
      });
  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
