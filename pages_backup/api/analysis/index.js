// pages/api/analysis/index.js
import dbConnect from "../../../lib/dbConnect";
import Analysis from "../../../models/Analysis";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const data = await Analysis.find({}).sort({ createdAt: -1 }).limit(20);
      return res.status(200).json(data);
    } catch (err) {
      console.error("Error loading analyses:", err);
      return res.status(500).json({ error: "Failed to load analyses" });
    }
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
