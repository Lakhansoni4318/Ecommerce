const Product = require("../models/productModel");
const Cart = require("../models/CartModel");
const Wishlist = require("../models/watchlistModel");

exports.addProduct = async (req, res) => {
  const {
    productName,
    productCategory,
    description,
    costPrice,
    sellingPrice,
    stock,
    imageUrls,
  } = req.body;

  try {
    if (
      !productName ||
      !productCategory ||
      !description ||
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
      description,
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
  const userId = req.user?.userId;

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

      return res.status(400).json({
        message:
          "To fetch full details, please use the /product-details/:id endpoint.",
      });
    }

    let query = {};
    if (category) {
      query.productCategory = category;
    }

    const products = await Product.find(query).select(
      "costPrice imageUrls productCategory productName sellingPrice stock description"
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: category
          ? `No products found in category "${category}"`
          : "No products available.",
      });
    }

    // Get user's cart and wishlist if authenticated
    let cartProductIds = [];
    let watchlistProductIds = [];

    if (userId) {
      const cart = await Cart.findOne({ userId });
      const wishlist = await Wishlist.findOne({ userId }); // renamed variable here

      cartProductIds = cart?.products.map((p) => p.productId.toString()) || [];
      watchlistProductIds =
        wishlist?.products.map((p) => p.productId.toString()) || [];
    }

    // Format product list
    const formattedProducts = products.map((p) => ({
      _id: p._id,
      costPrice: p.costPrice,
      imageUrls: p.imageUrls || "",
      productCategory: p.productCategory,
      productName: p.productName,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
      description: p.description || "",
      inCart: cartProductIds.includes(p._id.toString()),
      inWatchlist: watchlistProductIds.includes(p._id.toString()),
    }));

    return res.status(200).json({
      total: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return res.status(500).json({
      message: "Server error while fetching products. Please try again later.",
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

    const product = await Product.findById(id);

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
    let inWatchlist = false;

    if (userId) {
      const cart = await Cart.findOne({ userId, "products.productId": id });
      const wishlist = await Wishlist.findOne({
        userId,
        "products.productId": id,
      });

      inCart = !!cart;
      inWatchlist = !!wishlist;
    }

    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      userId: r.userId,
      username: r.username,
      title: r.title,
      description: r.description,
      rating: r.rating,
      createdAt: r.createdAt,
    }));

    return res.status(200).json({
      ...product.toObject(),
      rating,
      ratingCount,
      ratingAverage,
      reviews: formattedReviews,
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
    const { userId, username } = req.user; // Assuming authentication middleware sets this

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

    // Check if user already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Add new review with username
    product.reviews.push({
      userId,
      username,
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

    return res.status(201).json({
      message: "Review added successfully",
      ratingAverage: product.ratingAverage,
      ratingCount: product.ratingCount,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.multipleProductDetails = async (req, res) => {
  try {
    const productRequests = req.body;
    const userId = req.user?.userId;

    if (!Array.isArray(productRequests) || productRequests.length === 0) {
      return res.status(400).json({
        message: "Request must be a non-empty array of productId and quantity.",
      });
    }

    const productIds = productRequests.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for the provided IDs." });
    }

    const cart = userId ? await Cart.findOne({ userId }) : null;
    const wishlist = userId ? await Wishlist.findOne({ userId }) : null;

    const detailedProducts = products.map((product) => {
      const matchingItem = productRequests.find(
        (item) => item.productId.toString() === product._id.toString()
      );

      const quantity = matchingItem?.quantity || 1;

      const inCart = cart?.products.some(
        (p) => p.productId.toString() === product._id.toString()
      );

      const inWatchlist = wishlist?.products.some(
        (p) => p.productId.toString() === product._id.toString()
      );

      const formattedReviews = product.reviews.map((r) => ({
        _id: r._id,
        userId: r.userId,
        username: r.username,
        title: r.title,
        description: r.description,
        rating: r.rating,
        createdAt: r.createdAt,
      }));

      return {
        ...product.toObject(),
        quantity,
        rating: product.rating || 0,
        ratingCount: product.ratingCount || 0,
        ratingAverage: product.ratingAverage || 0,
        reviews: formattedReviews,
        inCart: !!inCart,
        inWatchlist: !!inWatchlist,
      };
    });

    return res.status(200).json({
      total: detailedProducts.length,
      products: detailedProducts,
    });
  } catch (error) {
    console.error("Multiple Product Details Error:", error);
    return res.status(500).json({
      message: "Server error while retrieving product details.",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from URL params

    if (!id?.trim()) {
      return res
        .status(400)
        .json({ message: "Product ID is required in the URL." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found with the provided ID." });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting product." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productCategory,
      description,
      costPrice,
      sellingPrice,
      stock,
      imageUrls,
    } = req.body;

    if (!id?.trim()) {
      return res
        .status(400)
        .json({ message: "Product ID is required in the URL." });
    }

    if (
      !productName ||
      !productCategory ||
      !description ||
      !costPrice ||
      !sellingPrice ||
      !stock ||
      !imageUrls ||
      !Array.isArray(imageUrls)
    ) {
      return res.status(400).json({
        message: "All fields are required and imageUrls must be an array.",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found with the provided ID." });
    }

    product.productName = productName;
    product.productCategory = productCategory;
    product.description = description;
    product.costPrice = costPrice;
    product.sellingPrice = sellingPrice;
    product.stock = stock;
    product.imageUrls = imageUrls;

    await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating product." });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({}).select("reviews");

    const allReviews = products.reduce((acc, product) => {
      const productReviews = product.reviews.map((review) => ({
        _id: review._id,
        userId: review.userId,
        username: review.username,
        title: review.title,
        description: review.description,
        rating: review.rating,
        createdAt: review.createdAt,
        productId: product._id,
      }));
      return acc.concat(productReviews);
    }, []);

    return res.status(200).json({
      total: allReviews.length,
      reviews: allReviews,
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching reviews." });
  }
};

exports.getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$productCategory",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return res.status(200).json({ categories: categoryStats });
  } catch (error) {
    console.error("Category Stats Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching categories." });
  }
};
