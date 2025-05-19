const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getSummary } = require('../controllers/statsController');

router.get("/summary", authenticate, getSummary);

module.exports = router;
