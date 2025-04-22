import axios from 'axios';

// Set to true for testing with dummy data
const USE_DUMMY_DATA = true; // ✅ Enable dummy mode

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'Missing URL' });
  }

  try {
    if (USE_DUMMY_DATA) {
      // Simulated response for development
      const dummyData = {
        address: "123 Main St, Miami, FL",
        listPrice: 400000,
        propertyTax: 4800,
        insurance: 1200,
        hoaFees: 200,
        estRent: 2900,
        repairs: 150,
        vacancy: 5,
        managementFee: 8,
        notes: `Auto-filled from ${url}`,
        zipStats: {
          taxes: 400,
          repairs: 150,
          vacancy: 5
        },
        comps: {
          avgRent: 2800,
          range: "$2600-$3100",
          occupancy: "92%",
          rentPerSqft: "$2.10"
        }
      };
      return res.status(200).json(dummyData);
    }

    if (!url.includes('redfin.com')) {
      return res.status(400).json({ message: 'Only Redfin URLs supported currently' });
    }

    const propertyId = url.split('/').filter(part => part.match(/^\d+$/)).pop();
    const apiResponse = await axios.get(`https://www.redfin.com/stingray/api/home/details/${propertyId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const propertyData = apiResponse.data.payload;
    return res.status(200).json(formatRedfinData(propertyData));

  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ 
      message: 'Failed to process property',
      error: error.message 
    });
  }
}

// Standardize data format
function formatRedfinData(data) {
  return {
    address: data.address || `${data.streetAddress}, ${data.city}, ${data.state} ${data.zip}`,
    listPrice: data.listPrice || data.price,
    estRent: data.estRent || data.rentEstimate,
    zipStats: {
      taxes: data.propertyTax || (data.taxHistory?.[0]?.taxPaid / 12),
      repairs: data.repairs || 150,
      vacancy: data.vacancy || 5
    },
    comps: {
      avgRent: data.comps?.avgRent || data.rentEstimate,
      range: data.comps?.range || "N/A",
      occupancy: data.occupancy || "N/A",
      rentPerSqft: data.rentPerSqft || "N/A"
    }
  };
}
