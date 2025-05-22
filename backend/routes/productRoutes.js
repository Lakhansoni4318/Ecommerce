const express = require('express');
const router = express.Router();
const { addProduct, allProducts, productDetails, addReview, multipleProductDetails } = require('../controllers/productController');
const authenticateToken = require('../middlewares/auth');

router.post('/add-product', authenticateToken, addProduct);
router.post('/all-products', authenticateToken, allProducts);
router.get('/product-details/:id', authenticateToken, productDetails);
router.post('/add-review', authenticateToken, addReview);
router.post("/products-details", authenticateToken, multipleProductDetails);

module.exports = router;
