const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopUserOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

const mongoURI = process.env.MONGO_URI || "mongodb+srv://Finstore:Admin123@cluster2003.zwiay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2003";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Atlas MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://finstore.dharsh.xyz",
  "https://ecommerce-frontend-blush-one.vercel.app",
  "https://ecommerce-frontend-git-main-sudarshanaraos-projects.vercel.app",
  "https://ecommerce-frontend-sudarshanaraos-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});


app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce API!");
});


app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight

app.use(cookieParser());
app.use(express.json());
app.use("/", (req, res) => {
  res.send("Welcome to the E-Commerce API!");
})
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/order", shopUserOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
