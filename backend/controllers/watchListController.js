const Watchlist = require('../models/watchlistModel');
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

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = new Watchlist({
        userId,
        products: [{ productId }],
      });
    } else {
      const productExists = watchlist.products.some(
        (item) => item.productId.toString() === productId
      );

      if (productExists) {
        return res.status(400).json({ message: 'Product is already in your watchlist' });
      }

      watchlist.products.push({ productId });
    }

    await watchlist.save();
    return res.status(200).json({ message: 'Product added to watchlist', watchlist });

  } catch (error) {
    console.error('Add to Watchlist Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    const initialCount = watchlist.products.length;
    watchlist.products = watchlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if (watchlist.products.length === initialCount) {
      return res.status(404).json({ message: 'Product not found in watchlist' });
    }

    await watchlist.save();
    return res.status(200).json({ message: 'Product removed from watchlist', watchlist });

  } catch (error) {
    console.error('Remove from Watchlist Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const watchlist = await Watchlist.findOne({ userId }).populate('products.productId');

    if (!watchlist) {
      return res.status(200).json({ products: [] });
    }

    return res.status(200).json({ products: watchlist.products });

  } catch (error) {
    console.error('Get Watchlist Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
