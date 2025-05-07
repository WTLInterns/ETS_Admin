import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaBan } from 'react-icons/fa';
import axios from 'axios';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);  // Initialize as empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlacklisted, setShowBlacklisted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/getVehicles');

      // Ensure we're setting an array, even if the response is empty or invalid
      setVehicles(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
      setVehicles([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  console.log('Vehicles:', vehicles);

  const filteredVehicles = (vehicles || []).filter(vehicle => {
    const isBlacklisted = vehicle?.status === 'blacklisted';
    if (showBlacklisted !== isBlacklisted) return false;
    
    if (!searchQuery) return true;
    
    return (
      vehicle?.vehicleNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {showBlacklisted ? "Blacklisted Vehicles" : "Cab List"}
          </h1>
          <button
            onClick={() => setShowBlacklisted(!showBlacklisted)}
            className={`px-4 py-2 rounded-md ${
              showBlacklisted 
                ? "bg-gray-500 hover:bg-gray-600" 
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {showBlacklisted ? "View Active Vehicles" : "Blacklisted Vehicles"}
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Vehicle No, Brand or Category"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Ownership</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Valid Up To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                      No vehicles found
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicleNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.modelType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.fuelType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.vehicleOwnership}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.registrationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.insuranceValidUpTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col gap-2">
                          {vehicle.insuranceCopy && (
                            <a href={vehicle.insuranceCopy} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Insurance Copy
                            </a>
                          )}
                          {vehicle.registrationCertificate && (
                            <a href={vehicle.registrationCertificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Registration Certificate
                            </a>
                          )}
                          {vehicle.vehiclePhoto && (
                            <a href={vehicle.vehiclePhoto} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Vehicle Photo
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
                            Edit
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                            {showBlacklisted ? 'Unblock' : 'Blacklist'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;