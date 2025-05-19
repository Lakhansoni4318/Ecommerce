const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    price: Number,
    image: String
  },
  address: String,
  paymentType: String,
  paymentDetails: {
    cardName: String,
    cardNumber: String,
    expiry: String
  },
  orderTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
