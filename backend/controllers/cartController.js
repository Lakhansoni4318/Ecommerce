const Cart = require('../models/CartModel');
const Product = require('../models/productModel');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !productId.trim()) {
      return res.status(400).json({ message: 'Please provide a valid product ID.' });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (!parsedQuantity || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid quantity.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found. Please check and try again.' });
    }

    if (parsedQuantity > product.stock) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock.' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: parsedQuantity }]
      });
    } else {
      const exists = cart.products.some(
        (item) => item.productId.toString() === productId
      );

      if (exists) {
        return res.status(400).json({ message: 'This product is already in your cart.' });
      }

      cart.products.push({ productId, quantity: parsedQuantity });
    }

    await cart.save();
    return res.status(200).json({ message: 'Product successfully added to your cart.', cart });

  } catch (error) {
    console.error('Add to Cart Error:', error);
    return res.status(500).json({ message: 'An error occurred while adding to cart. Please try again.' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId || !productId.trim()) {
      return res.status(400).json({ message: 'Please provide a valid product ID.' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in your cart.' });
    }

    cart.products.splice(productIndex, 1);

    if (cart.products.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: 'Product removed from cart.', cart: [] });
    }

    await cart.save();
    return res.status(200).json({ message: 'Product removed from cart.', cart });

  } catch (error) {
    console.error('Remove from Cart Error:', error);
    return res.status(500).json({ message: 'An error occurred while removing from cart. Please try again.' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty.', cart: [] });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error('Get Cart Error:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the cart.' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body; // should be an array of { productId, quantity }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Please provide a valid list of products.' });
    }

    // Validate each product update
    for (const item of updates) {
      if (!item.productId || !item.productId.trim()) {
        return res.status(400).json({ message: 'Invalid product ID provided.' });
      }
      const parsedQuantity = parseInt(item.quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        return res.status(400).json({ message: 'Invalid quantity provided.' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (parsedQuantity > product.stock) {
        return res.status(400).json({ message: `Quantity for product ${item.productId} exceeds available stock.` });
      }
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Map current cart products for easier updates
    const productMap = new Map();
    cart.products.forEach(item => {
      productMap.set(item.productId.toString(), item);
    });

    // Apply updates
    for (const item of updates) {
      const quantity = parseInt(item.quantity, 10);
      const existingItem = productMap.get(item.productId);

      if (quantity === 0) {
        // Remove product if quantity is 0
        cart.products = cart.products.filter(p => p.productId.toString() !== item.productId);
        continue;
      }

      if (existingItem) {
        // Update quantity
        existingItem.quantity = quantity;
      } else {
        // Add new product
        cart.products.push({
          productId: item.productId,
          quantity
        });
      }
    }

    // If no products remain, delete cart
    if (cart.products.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: 'Cart updated. Cart is now empty.', cart: [] });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('products.productId');
    return res.status(200).json({ message: 'Cart updated successfully.', cart: updatedCart });

  } catch (error) {
    console.error('Update Cart Error:', error);
    return res.status(500).json({ message: 'An error occurred while updating the cart.' });
  }
};
