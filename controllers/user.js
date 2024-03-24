const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const { createAccessToken } = auth;

// [SECTION] User Registration
module.exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, mobileNo, password } = req.body; // Use req.body to get user input
  console.log(req.body);

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send(false);
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      mobileNo,
      password: bcrypt.hashSync(password, 10),
    });

    await newUser.save();

    return res.send(true);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// [SECTION] LogIn User Authentication
module.exports.loginUser = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((result) => {
      console.log(result);

      // User does not exist
      if (result == null) {
        return res.send(false);

        // User exists
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );
        // If the passwords match/result of the above code is true
        if (isPasswordCorrect) {
          return res.send({ access: createAccessToken(result) });

          // Passwords do not match
        } else {
          return res.send(false);
        }
      }
    })
    .catch((err) => res.send(err));
};
// [SECTION] Update User Profile
module.exports.updateProfile = async (req, res) => {
  const { firstName, lastName, mobileNo } = req.body;
  const userId = req.user.id; // Assuming you have a middleware to extract the user's ID from the JWT.

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.mobileNo = mobileNo || user.mobileNo;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [SECTION] Password Reset
module.exports.resetPassword = async (req, res) => {
  // Assuming user ID is extracted from the authorized JWT token

  try {
    const { newPassword } = req.body;
    const { id } = req.user;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// [SECTION] Create Order/Check-Out
module.exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  try {
    // Check if the user and product exist
    const [user, product] = await Promise.all([
      User.findById(userId),
      Product.findById(productId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new order
    const newOrder = {
      productId,
      productName: product.name, // Assuming you want to store the product name
      quantity,
    };

    user.orderedProductArray.push({
      products: newOrder,
      totalAmount: quantity * product.price,
      purchasedOn: new Date(),
    });

    await user.save();

    // Update the product's userOrders
    /* product.userOrders.push({ userId, orderId: product._id });
    await product.save(); */
    product.userOrders.push({ userId, orderId: newOrder._id }); // Store the product's ID as the orderId
    await product.save();

    return res.send({ message: "Order created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [SECTION] Get User Details
module.exports.userDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((result) => {
      result.password = "";
      return res.send(result);
    })
    .catch((err) => res.send(err));
};

/* ----------------------------- Stretch Activity -------------- */
// [SECTION] strecth Set user as Admin
module.exports.setUserAdmin = async (req, res) => {
  const userId = req.params.userId;
  const isAdmin = req.body.isAdmin;

  try {
    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the isAdmin status
    user.isAdmin = isAdmin;

    await user.save();

    return res
      .status(200)
      .json({ message: "User admin status updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [SECTION] strecth get authenticated user's orders

module.exports.getUserOrders = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const orders = user.orderedProductArray;

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }

      return res.status(200).json(orders);
    })
    .catch((err) => res.status(500).json({ message: "Internal server error" }));
};

// [SECTION] strecth get all user's orders
module.exports.getAllOrders = async (req, res) => {
  try {
    const users = await User.find({});
    const allOrders = users.map((user) => user.orderedProductArray).flat();

    if (allOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(allOrders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [SECTION] strecth Get All User's Cart Items
module.exports.getCartItems = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cart;

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    return res
      .status(200)
      .json({ cart: cartItems, cartItemsTotal: user.totalCartItemsPrice });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [SECTION] strecth Add to Cart and Update Cart Quantity -use(Add)operation and Remove from Cart -use(remove)
module.exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const operation = req.body.operation; // 'add' or 'remove' operation

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!user.cart) {
      user.cart = [];
    }

    if (operation === "add") {
      const existingCartItem = user.cart.find(
        (item) => item.productId === productId
      );

      if (existingCartItem) {
        // If the item already exists in the cart, update its quantity and subtotal
        existingCartItem.quantity = quantity;
        existingCartItem.subtotal = quantity * product.price;
      } else {
        // If the item doesn't exist in the cart, add it as a new item
        const newCartItem = {
          productId,
          productName: product.name,
          quantity,
          price: product.price,
          subtotal: quantity * product.price,
        };

        user.cart.push(newCartItem);
      }
    } else if (operation === "remove") {
      // Remove the item from the cart
      const cartItemIndex = user.cart.findIndex(
        (item) => item.productId === productId
      );
      if (cartItemIndex !== -1) {
        user.cart.splice(cartItemIndex, 1);
      }
    }

    // Calculate the total cart price
    user.totalCartItemsPrice = user.cart.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    await user.save();

    return res
      .status(200)
      .json({ cart: user.cart, cartItemsTotal: user.totalCartItemsPrice }); // Return the updated cart as JSON
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
// [SECTION] strecth CheckOut Add to cart
/* All that is in the cart will be checked out and will be put in the orderedproductarray with */
module.exports.checkoutCartOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        message: "Cart is empty. Add items to your cart before checking out.",
      });
    }

    // Calculate the total order amount
    const totalOrderAmount = user.cart.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    // Create a new order object
    const order = {
      products: user.cart,
      totalAmount: totalOrderAmount,
      purchasedOn: new Date(),
    };

    // Add the order to the user's orderedProductArray
    user.orderedProductArray.push(order);

    // Clear the user's cart
    user.cart = [];

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
