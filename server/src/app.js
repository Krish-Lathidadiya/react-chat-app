require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { errorMiddleware } = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppRoute = require("./routes");
const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST"],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

// Define routes here
app.use(AppRoute);

//error handling middleware
app.use(errorMiddleware);

// Export the app
module.exports = app;
