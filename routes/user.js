// [SECTION] Dependencies & Modules
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
// Import Path
const { verify, verifyAdmin } = auth;

// [SECTION] Routing Components
const router = express.Router();

// User Routers
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/update-profile", verify, userController.updateProfile);
router.put("/reset-password", verify, userController.resetPassword);
router.put("/checkout", verify, userController.createOrder);
router.get("/user-details", verify, userController.userDetails);

// Strecth routes
// [SECTION] Route for updating User isAdmin:True/False
router.put(
  "/:userId/set-asAdmin",
  verify,
  verifyAdmin,
  userController.setUserAdmin
);
router.get("/my-orders", verify, userController.getUserOrders);
router.get("/get-all-orders", verify, verifyAdmin, userController.getAllOrders);
router.get("/get-all-cart-items", verify, userController.getCartItems);
router.post("/add-to-cart", verify, userController.addToCart);
// Cart Create Order
router.post("/cart-checkout-orders", verify, userController.checkoutCartOrders);

// [SECTION] Export Route System
module.exports = router;
