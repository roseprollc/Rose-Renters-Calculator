const express = require("express");
const router = express.Router();
const Analysis = require("../models/analysis");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT and extract user
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ TEMP ROUTE — Save without auth for testing purposes only
router.post("/test-save", async (req, res) => {
  console.log("📥 Received POST to /api/analysis/test-save");
  try {
    console.log("📦 Incoming Body:", req.body);
    const analysis = new Analysis(req.body);
    const saved = await analysis.save();
    console.log("✅ Saved test analysis:", saved._id);
    res.status(201).json({ id: saved._id });
  } catch (err) {
    console.error("❌ Test save failed:", err);
    res.status(500).json({ error: "Test save failed" });
  }
});

// ✅ TEMP ROUTE — Get all saved analyses (no auth)
router.get("/test-all", async (req, res) => {
  console.log("📤 GET request to /api/analysis/test-all");
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });
    console.log(`📦 Retrieved ${analyses.length} test analyses`);
    res.json(analyses);
  } catch (err) {
    console.error("❌ Failed to fetch test analyses:", err);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// Save a new analysis (requires auth)
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const analysis = new Analysis({
      ...req.body,
      userId: req.user.id,
      email: req.user.email,
    });
    const saved = await analysis.save();
    res.status(201).json({ id: saved._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save analysis" });
  }
});

// Get all analyses for the logged-in user
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// Get a public analysis by ID (no auth)
router.get("/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: "Not found" });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: "Error loading analysis" });
  }
});

// Delete analysis (auth required)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!analysis) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting analysis" });
  }
});

module.exports = router;
