const express = require('express');
const router = express.Router();
const { signUp, verifyOtp, signIn } = require('../controllers/authController');

router.post('/signup', signUp);

router.post('/verify-otp', verifyOtp);

router.post('/sign-in', signIn);


module.exports = router;
