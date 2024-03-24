const express = require("express");
const productController = require("../controllers/product");
const auth = require("../middlewares/auth");
const { verify, verifyAdmin } = auth;

// [SECTION] Routing Components
const router = express.Router();

// Product Routers
router.post("/add-product", verify, verifyAdmin, productController.addProduct);
router.get("/all-product", productController.allProduct);
router.get("/all-product-admin", productController.allProductsAdmin);
//[SECTION] Route for Search Course by Name
router.post("/searchByName", productController.searchProductByName);
router.get("/:productId/single-product", productController.singleProduct);
router.put(
  "/:productId/update-product",
  verify,
  verifyAdmin,
  productController.updateProduct
);
router.put(
  "/:productId/archive-product",
  verify,
  verifyAdmin,
  productController.archiveProduct
);
router.put(
  "/:productId/activate-product",
  verify,
  verifyAdmin,
  productController.activateProduct
);

// [SECTION] Export Route System
module.exports = router;
