const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: String,
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  address: { type: String, required: true },
  phone: { type: String }, // optional, add validation if needed
  paymentType: {
    type: String,
    enum: ['cash', 'card', 'credit', 'debit'],
    required: true
  },
  paymentDetails: {
    cardName: String,
    cardNumber: String,
    expiry: String
  },
  orderTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
