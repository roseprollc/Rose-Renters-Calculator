const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ Routes
const authRoutes = require("./routes/auth");
const analysisRoutes = require("./routes/analysis"); // ✅ Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes); // ✅ Use analysis routes

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🌹 RoseIntel Backend is Running");
});

// ✅ MongoDB + Server Boot
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
