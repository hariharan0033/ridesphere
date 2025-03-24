const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const rideRoutes = require("./routes/rideRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS

// API Routes
app.use("/api/users", userRoutes); // User authentication routes
app.use("/api/rides", rideRoutes); // Ride posting routes

// Basic Route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the root route!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
