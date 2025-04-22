// models/Analysis.js
import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  email: { type: String },
  mode: { type: String },
  tags: { type: String },
  purchasePrice: { type: String },
  monthlyRent: { type: String },
  propertyTax: { type: String },
  insurance: { type: String },
  results: {
    mortgagePayment: String,
    totalExpenses: String,
    monthlyCashFlow: String,
    annualCashFlow: String,
    roi: String,
    capRate: String,
    breakevenRent: String,
    mao: String,
  },
}, { timestamps: true });

export default mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);
