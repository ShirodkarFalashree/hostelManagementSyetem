const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Database connection
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hostel Management System API is running 🚀",
    timestamp: new Date().toISOString(),
    version: "2.5.0",
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Hostel Management API server running on port ${PORT}`);
});