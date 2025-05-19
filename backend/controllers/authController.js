const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const otpGenerator = require('otp-generator');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

function generateNumericOtp() {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
}

exports.signUp = async (req, res) => {
  const { username, email, password, accountType } = req.body;

  try {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateNumericOtp();
    const otpExpiration = Date.now() + (5 * 60 * 1000);

    // Save user in MongoDB directly
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      accountType,
      otp,
      otpExpiration,
      isVerified: false,
    });

    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for verification',
      text: `Your OTP is: ${otp}`,
    });

    return res.status(200).json({ message: 'User created, OTP sent to email' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found, please sign up first' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified, please sign in.' });
    }

    if (Date.now() > user.otpExpiration) {
      return res.status(400).json({ message: 'OTP expired, please request a new one' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.status(200).json({ message: 'OTP verified', token });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'User not verified. Please verify your email.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.status(200).json({ message: 'Sign-in successful', token });
  } catch (error) {
    console.error('SignIn Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp -otpExpiration'); // exclude sensitive fields
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
