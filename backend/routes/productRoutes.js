const express = require("express");
const router = express.Router();
const {
  addProduct,
  allProducts,
  productDetails,
  addReview,
  multipleProductDetails,
  deleteProduct,
  updateProduct,
  getAllReviews,
  getCategoryStats,
} = require("../controllers/productController");
const authenticateToken = require("../middlewares/auth");

router.post("/add-product", authenticateToken, addProduct);
router.post("/all-products", authenticateToken, allProducts);
router.get("/product-details/:id", authenticateToken, productDetails);
router.post("/add-review", authenticateToken, addReview);
router.post("/products-details", authenticateToken, multipleProductDetails);
router.delete("/:id", authenticateToken, deleteProduct);
router.put("/:id", authenticateToken, updateProduct);
router.get("/reviews", authenticateToken, getAllReviews);
router.get("/category-stats", authenticateToken, getCategoryStats);
module.exports = router;
