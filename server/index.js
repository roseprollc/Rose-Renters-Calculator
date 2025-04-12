const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ✅ Base route for testing
app.get("/", (req, res) => {
  res.send("🚀 RoseIntel backend is live!");
});

// ✅ Routes
const analysisRoutes = require("./routes/analysis");
app.use("/api/analysis", analysisRoutes);

// 🔌 Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.warn("⚠️ No MONGO_URI environment variable found!");
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🌹 Rose Renters Calculator backend running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
