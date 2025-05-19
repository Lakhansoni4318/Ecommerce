const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orderController');
const authenticate = require('../middlewares/auth');

router.post('/', authenticate, createOrder);
router.get('/getOrders', authenticate, getAllOrders);

module.exports = router;
