const mongoose = require("mongoose");

//[SECTION] Schema/Blueprint

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  userOrders: [
    {
      userId: {
        type: String,
        required: [true, "Costumer ID is Required"],
      },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
