const mongoose = require("mongoose");

//[SECTION] Schema/Blueprint

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, "Product ID is Required"],
  },
  productName: {
    type: String,
    required: [true, "Product name is Required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is Required"],
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
  },
  subtotal: {
    type: Number,
    required: [true, "Subtotal is Required"],
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
  },
  orderedProductArray: [
    {
      products: [
        {
          productId: {
            type: String,
            required: [true, "Product ID is Required"],
          },
          productName: {
            type: String,
            required: [true, "Product name is Required"],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is Required"],
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: [true, "Total amount price is required"],
      },
      purchasedOn: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  cart: [cartItemSchema],
  totalCartItemsPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
