import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PairingVehicle = () => {
  const [pairingData, setPairingData] = useState({
    driverId: '',
    vehicleId: '',
    startDate: '',
    endDate: ''
  });

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDriversAndVehicles();
  }, []);

  const fetchDriversAndVehicles = async () => {
    try {
      setLoading(true);
      const [driversResponse, vehiclesResponse] = await Promise.all([
        axios.get('http://localhost:8080/getDrivers'),
        axios.get('http://localhost:8080/getVehicles')
      ]);

      // Filter out already paired drivers and vehicles
      const availableDrivers = (driversResponse.data.data || []).filter(driver => !driver.paired);
      const availableVehicles = (vehiclesResponse.data.data || []).filter(vehicle => !vehicle.paired);

      setDrivers(availableDrivers);
      setVehicles(availableVehicles);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Changed to match backend endpoint
      const response = await axios.post(
        `http://localhost:8080/addPair/${pairingData.vehicleId}/${pairingData.driverId}`
      );
      
      if (response.data.success) {
        setSuccessMessage('Pairing created successfully!');
        setPairingData({
          driverId: '',
          vehicleId: '',
          startDate: '',
          endDate: ''
        });
        // Refresh the drivers and vehicles lists after successful pairing
        fetchDriversAndVehicles();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to create pairing.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create pairing. Please try again.');
      console.error('Error creating pairing:', err);
    }
  };

  const handleChange = (e) => {
    setPairingData({
      ...pairingData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Pair Vehicle with Driver</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Driver:
            </label>
            <select
              name="driverId"
              value={pairingData.driverId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver._id} value={driver._id}>
                  {driver.name} - {driver.license_id_number}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vehicle:
            </label>
            <select
              name="vehicleId"
              value={pairingData.vehicleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicle_number} - {vehicle.brand} {vehicle.model_type}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date:
            </label>
            <input
              type="date"
              name="startDate"
              value={pairingData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date:
            </label>
            <input
              type="date"
              name="endDate"
              value={pairingData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Pairing
          </button>
        </form>
      </div>
    </div>
  );
};

export default PairingVehicle;