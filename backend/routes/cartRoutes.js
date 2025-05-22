const express = require('express');
const { addToCart, getCart, removeFromCart, updateCart } = require('../controllers/cartController');
const { authenticate } = require('../controllers/authMiddleware');

const router = express.Router();

router.post('/add-to-cart', authenticate, addToCart);
router.delete('/remove/:productId', authenticate, removeFromCart);
router.get('/', authenticate, getCart);
router.put('/update', authenticate, updateCart);

module.exports = router;
