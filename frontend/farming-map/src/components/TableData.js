import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FarmerDataTable = () => {
  const [farmerData, setFarmerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/post-data/');
        setFarmerData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching farmer data:', err);
        setError('Failed to fetch farmer data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchFarmerData();
  }, []);

  const handleDelete = async (farmerId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/post-data/${farmerId}/`);
      setFarmerData(farmerData.filter((farmer) => farmer.id !== farmerId));
    } catch (err) {
      console.error('Error deleting farmer data:', err);
      setError('Failed to delete farmer data. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Farmer Data</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Farmer Name</th>
              <th className="py-2 px-4 text-left">Farmer ID</th>
              <th className="py-2 px-4 text-left">Plant Type</th>
              <th className="py-2 px-4 text-left">Plant Count</th>
              <th className="py-2 px-4 text-left">Latitude</th>
              <th className="py-2 px-4 text-left">Longitude</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmerData.map((farmer) => (
              <tr key={farmer.id} className="border-b">
                <td className="py-2 px-4">{farmer.farmer_name || 'N/A'}</td>
                <td className="py-2 px-4">{farmer.farmer_id || 'N/A'}</td>
                <td className="py-2 px-4">{farmer.plant_type || 'N/A'}</td>
                <td className="py-2 px-4">{farmer.plant_count || 'N/A'}</td>
                <td className="py-2 px-4">{farmer.latitude || 'N/A'}</td>
                <td className="py-2 px-4">{farmer.longitude || 'N/A'}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(farmer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FarmerDataTable;