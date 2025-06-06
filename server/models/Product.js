const mongoose = require("mongoose");

const SizeDetailSchema = new mongoose.Schema(
  {
    stock: Number,
    price: Number,
    salePrice: Number,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: Map,
      of: SizeDetailSchema, // S, M, L, etc. as keys
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
