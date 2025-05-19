const express = require('express');
const router = express.Router();
const { addToWatchlist, removeFromWatchlist, getWatchlist } = require('../controllers/watchListController');
const { authenticate } = require('../controllers/authMiddleware');
router.post('/add', authenticate, addToWatchlist);
router.delete('/remove/:productId', authenticate, removeFromWatchlist);
router.get('/', authenticate, getWatchlist);

module.exports = router;
