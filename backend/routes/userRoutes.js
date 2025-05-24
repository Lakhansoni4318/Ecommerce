const express = require('express');
const { authenticate } = require('../controllers/authMiddleware');
const { getMyProfile } = require('../controllers/userController');
const { getAllUsers, checkToken, updateProfile } = require('../controllers/authController');
const router = express.Router();

router.get('/', authenticate, getAllUsers);
router.get('/profile', authenticate, getMyProfile);
router.get('/check-token', checkToken);
router.put('/profile',  authenticate, updateProfile);

module.exports = router;
