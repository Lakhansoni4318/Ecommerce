const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    reviews: [reviewSchema],
    ratingCount: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
