import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddVehicles = () => {
  const [vehicleData, setVehicleData] = useState({
    vehicle_number: '',
    vehicle_category: '',
    brand: '',
    model_type: '',
    fuel_type: '',
    vehicle_ownership: '',
    registration_date: '',
    insurance_valid: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!vehicleData.vehicle_number) newErrors.vehicle_number = 'Vehicle number is required';
    if (!vehicleData.vehicle_category) newErrors.vehicle_category = 'Vehicle category is required';
    if (!vehicleData.brand) newErrors.brand = 'Brand is required';
    if (!vehicleData.model_type) newErrors.model_type = 'Model type is required';
    if (!vehicleData.fuel_type) newErrors.fuel_type = 'Fuel type is required';
    if (!vehicleData.registration_date) newErrors.registration_date = 'Registration date is required';
    if (!vehicleData.insurance_valid) newErrors.insurance_valid = 'Insurance validity date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8080/addVehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(vehicleData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setVehicleData({
          vehicle_number: '',
          vehicle_category: '',
          brand: '',
          model_type: '',
          fuel_type: '',
          vehicle_ownership: '',
          registration_date: '',
          insurance_valid: '',
        });
      } else {
        const errorMessage = await response.text();
        throw new Error(`Server error (${response.status}): ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setErrors({ submit: 'Failed to add vehicle. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add Vehicle</h1>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            Vehicle added successfully!
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle No:
            </label>
            <input
              type="text"
              name="vehicle_number"
              value={vehicleData.vehicle_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.vehicle_number && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicle_number}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Category:
            </label>
            <input
              type="text"
              name="vehicle_category"
              value={vehicleData.vehicle_category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.vehicle_category && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicle_category}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand:
            </label>
            <input
              type="text"
              name="brand"
              value={vehicleData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type:
            </label>
            <input
              type="text"
              name="model_type"
              value={vehicleData.model_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.model_type && (
              <p className="text-red-500 text-sm mt-1">{errors.model_type}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type:
            </label>
            <input
              type="text"
              name="fuel_type"
              value={vehicleData.fuel_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fuel_type && (
              <p className="text-red-500 text-sm mt-1">{errors.fuel_type}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Ownership:
            </label>
            <input
              type="text"
              name="vehicle_ownership"
              value={vehicleData.vehicle_ownership}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Date:
            </label>
            <input
              type="date"
              name="registration_date"
              value={vehicleData.registration_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.registration_date && (
              <p className="text-red-500 text-sm mt-1">{errors.registration_date}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Valid To:
            </label>
            <input
              type="date"
              name="insurance_valid"
              value={vehicleData.insurance_valid}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.insurance_valid && (
              <p className="text-red-500 text-sm mt-1">{errors.insurance_valid}</p>
            )}
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicles;