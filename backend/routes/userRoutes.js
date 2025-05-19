const express = require('express');
const { authenticate } = require('../controllers/authMiddleware');
const { getMyProfile } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/authController');
const router = express.Router();

router.get('/', authenticate, getAllUsers);
router.get('/profile', authenticate, getMyProfile);


module.exports = router;
