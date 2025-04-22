export async function fetchSmartImportData(url) {
    try {
      const res = await fetch('/api/smart-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch property data.');
      }
  
      const result = await res.json();
      return result.data;
    } catch (err) {
      console.error('Smart Import Error:', err);
      throw err;
    }
  }
  