const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the schema used for saving an analysis
const analysisSchema = new mongoose.Schema(
  {
    purchasePrice: Number,
    downPayment: Number,
    loanTerm: Number,
    interestRate: Number,
    monthlyRent: Number,
    vacancyRate: Number,
    propertyTax: Number,
    insurance: Number,
    repairs: Number,
    managementFee: Number,
    hoaFees: Number,
    results: Object,
  },
  { timestamps: true }
);

// Create the model from the schema
const Analysis = mongoose.model("Analysis", analysisSchema);

// Route to get ALL saved analyses (for dashboard/listing)
router.get("/all", async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to save a new analysis
router.post("/save", async (req, res) => {
  try {
    const newAnalysis = new Analysis(req.body);
    const saved = await newAnalysis.save();
    res.json({ id: saved._id });
  } catch (err) {
    res.status(500).json({ error: "Could not save analysis" });
  }
});

// Route to fetch a single analysis by ID
router.get("/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: "Not found" });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
