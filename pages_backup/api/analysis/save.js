// pages/api/analysis/save.js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const newAnalysis = req.body;

    // Path to the mock DB file
    const filePath = path.join(process.cwd(), "server", "db.json");

    try {
      const fileData = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
        : [];

      const updatedData = [...fileData, { ...newAnalysis, id: Date.now().toString() }];
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

      res.status(200).json({ success: true, message: "Saved!", id: Date.now().toString() });
    } catch (error) {
      console.error("Save failed:", error);
      res.status(500).json({ success: false, message: "Failed to save analysis." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
