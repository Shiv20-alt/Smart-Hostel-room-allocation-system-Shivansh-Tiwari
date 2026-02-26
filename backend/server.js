require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const roomRoutes = require("./routes/roomRoutes");
const allocationRoutes = require("./routes/allocationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/allocate", allocationRoutes);
app.use("/api/allocations", allocationRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "SHMS API is running 🏨" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
