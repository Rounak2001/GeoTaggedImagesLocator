import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FarmerDataTable = () => {
  const [farmerData, setFarmerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await axios.get('https://geotaggedimageslocator-2.onrender.com/api/post-data/');
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
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/post-data/${farmerId}/`);
      setFarmerData(farmerData.filter((farmer) => farmer.id !== farmerId));
    } catch (err) {
      console.error('Error deleting farmer data:', err);
      setError('Failed to delete farmer data. Please try again later.');
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Farmer Records</h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Records: {farmerData.length}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <div className="text-red-500 bg-red-50 p-4 rounded-md">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {farmerData.map((farmer) => (
                <tr 
                  key={farmer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {farmer.farmer_name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {farmer.farmer_id || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {farmer.plant_type || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Count: {farmer.plant_count || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      Lat: {farmer.latitude?.toFixed(6) || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Long: {farmer.longitude?.toFixed(6) || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(farmer.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {farmerData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No farmer records found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDataTable;