const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// MongoDB Schema
const analysisSchema = new mongoose.Schema({
  data: Object,
});
const Analysis = mongoose.model("Analysis", analysisSchema);

// Save analysis
app.post("/api/save", async (req, res) => {
  try {
    const newAnalysis = new Analysis({ data: req.body });
    const saved = await newAnalysis.save();
    res.json({ id: saved._id });
  } catch (err) {
    console.error("Error saving analysis:", err);
    res.status(500).json({ message: "Failed to save analysis" });
  }
});

// Load analysis by ID
app.get("/api/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: "Not found" });
    res.json(analysis.data);
  } catch (err) {
    console.error("Error retrieving analysis:", err);
    res.status(500).json({ message: "Error retrieving analysis" });
  }
});

// Connect to MongoDB and start the server
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
