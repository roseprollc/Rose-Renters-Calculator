const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 👈 Ensures every analysis is linked to a user
    },
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
    pmi: Number,
    tags: String,
    results: {
      mortgagePayment: String,
      totalExpenses: String,
      monthlyCashFlow: String,
      annualCashFlow: String,
      roi: String,
    },
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
