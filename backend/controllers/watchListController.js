const Wishlist = require('../models/watchlistModel');
const Product = require('../models/productModel');

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [{ productId }],
      });
    } else {
      const productExists = wishlist.products.some(
        (item) => item.productId.toString() === productId
      );

      if (productExists) {
        return res.status(400).json({ message: 'Product is already in your Wishlist' });
      }

      wishlist.products.push({ productId });
    }

    await wishlist.save();
    return res.status(200).json({ message: 'Product added to Wishlist', wishlist });

  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const initialCount = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if (wishlist.products.length === initialCount) {
      return res.status(404).json({ message: 'Product not found in Wishlist' });
    }

    await wishlist.save();
    return res.status(200).json({ message: 'Product removed from Wishlist', wishlist });

  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(404).json({ message: 'Wishlist is empty or not found' });
    }

    // Return the Wishlist with populated product info
    return res.status(200).json({ wishlist });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
