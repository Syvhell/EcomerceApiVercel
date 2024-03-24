const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Import Paths
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const port = 4002;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connecting to DB
mongoose.connect(
  "mongodb+srv://admin:admin@zuitt-bootcamp.xuatuvr.mongodb.net/Mophies?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// Send Status to the console if connection is successful
mongoose.connection.once("open", () =>
  console.log("Connected to the MongoDB Atlas")
);
// END of Connection DB

// [SECTION] Backend Routes
app.use("/b2/users", userRoutes);
app.use("/b2/products", productRoutes);

// App Port listen
app.listen(process.env.PORT || port, () => {
  console.log(`API is now online on port ${process.env.PORT || port}`);
});
