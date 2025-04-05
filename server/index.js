const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ✅ Add this route controller for all analysis routes
const analysisRoutes = require("./routes/analysis");
app.use("/api/analysis", analysisRoutes);

// 🔌 Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🌹 Rose Renters Calculator backend running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
