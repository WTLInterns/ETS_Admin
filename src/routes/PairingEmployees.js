import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PairingEmployees = () => {
  const [pairingData, setPairingData] = useState({
    employeeId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    purpose: ''
  });

  const [employees, setEmployees] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeesAndDrivers();
  }, []);

  const fetchEmployeesAndDrivers = async () => {
    try {
      setLoading(true);
      const [employeesResponse, driversResponse] = await Promise.all([
        axios.get('http://localhost:8080/getEmployees'),
        axios.get('http://localhost:8080/getDrivers')
      ]);

      if (employeesResponse.data.success && driversResponse.data.success) {
        // Filter out employees who already have drivers assigned
        const availableEmployees = employeesResponse.data.data.filter(emp => !emp.driver);
        setEmployees(availableEmployees);
        
        // Filter out drivers who are already paired
        const availableDrivers = driversResponse.data.data.filter(driver => !driver.paired);
        setDrivers(availableDrivers);
        setError(null);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement employee-vehicle pairing logic
    console.log('Pairing data:', pairingData);
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Pair Employee with Driver</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee:
            </label>
            <select
              name="employeeId"
              value={pairingData.employeeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} - {employee.email}
                </option>
              ))}
            </select>
          </div>

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
                  {driver.name} - {driver.mobile}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose:
            </label>
            <textarea
              name="purpose"
              value={pairingData.purpose}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              required
            />
          </div>

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

export default PairingEmployees;