const Product = require("../models/Product");
/* const User = require("../models/User"); */

// [SECTION] Add Product
module.exports.addProduct = async (req, res) => {
  const { name, description, price, image } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image,
    });

    await newProduct.save();

    return res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [Section] Retrieve all Products from DB - Users
module.exports.allProduct = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [Section] Retrieve all Products from DB -Admin
module.exports.allProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ChatGPT Generated Code

module.exports.searchProductByName = async (req, res) => {
  try {
    const { productName } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const products = await Product.find({
      name: { $regex: productName, $options: "i" },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Section] Retrieve specific single product using ID from DB
module.exports.singleProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Internal server errort" });
  }
};

// [Section] Update product using ID from DB
module.exports.updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const { name, description, price, image } = req.body;

  try {
    // Check if the product with the given ID exists
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Construct the update object
    const updateProductInfo = {
      name,
      description,
      price,
      image,
    };

    await Product.findByIdAndUpdate(productId, updateProductInfo);

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [Section] Archive product
module.exports.archiveProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Check if the product with the given ID exists
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Construct the update object to archive the product
    const archivedProduct = {
      isActive: false,
    };

    await Product.findByIdAndUpdate(productId, archivedProduct);

    return res.status(200).json({ message: "Product archived successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [Section] Activate product
module.exports.activateProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Check if the product with the given ID exists
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Construct the update object to activate the product
    const activatedProduct = {
      isActive: true,
    };

    await Product.findByIdAndUpdate(productId, activatedProduct);

    return res.status(200).json({ message: "Product activated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
