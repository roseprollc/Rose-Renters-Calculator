const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🚀 RoseIntel backend is running!");
});

app.post("/api/analysis/save", (req, res) => {
  const data = req.body;

  // Extract and log the new tags/notes
  const { purchasePrice, monthlyRent, tags, results } = data;

  const fakeId = Date.now().toString();

  console.log("💾 Received analysis data:");
  console.log("📌 Purchase Price:", purchasePrice);
  console.log("💰 Monthly Rent:", monthlyRent);
  console.log("📝 Notes / Tags:", tags);
  console.log("📊 Results:", results);

  res.status(200).json({ message: "Saved successfully", id: fakeId });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌸 Server running on http://localhost:${PORT}`);
});
