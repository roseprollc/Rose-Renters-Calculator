export default async function handler(req, res) {
    const {
      query: { id },
      method,
    } = req;
  
    if (method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      // Simulated mock data — replace with real DB lookup if needed
      const mockData = {
        id,
        email: "test@roseintel.ai",
        purchasePrice: "350000",
        results: {
          mortgagePayment: "1400",
          totalExpenses: "2100",
          monthlyCashFlow: "1300",
          annualCashFlow: "15600",
          roi: "11.3",
          capRate: "6.4",
          breakevenRent: "1800",
        },
        tags: "Miami ZIP 33101",
      };
  
      return res.status(200).json(mockData);
    } catch (err) {
      console.error("Load error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
  