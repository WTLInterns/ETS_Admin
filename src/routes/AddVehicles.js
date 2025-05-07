import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddVehicles = () => {
  const [vehicleData, setVehicleData] = useState({
    vehicleNumber: '',
    vehicleCategory: '',
    brand: '',
    modelType: '',
    fuelType: '',
    vehicleOwnership: '',
    registrationDate: '',
    insuranceValidTo: '',
    insuranceCopy: null,
    registrationCertificateFront: null,
    registrationCertificateBack: null,
    vehiclePhoto: null
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!vehicleData.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!vehicleData.vehicleCategory) newErrors.vehicleCategory = 'Vehicle category is required';
    if (!vehicleData.brand) newErrors.brand = 'Brand is required';
    if (!vehicleData.modelType) newErrors.modelType = 'Model type is required';
    if (!vehicleData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!vehicleData.registrationDate) newErrors.registrationDate = 'Registration date is required';
    if (!vehicleData.insuranceValidTo) newErrors.insuranceValidTo = 'Insurance validity date is required';
    
    // File validations
    if (!vehicleData.insuranceCopy) newErrors.insuranceCopy = 'Insurance copy is required';
    if (!vehicleData.registrationCertificateFront) newErrors.registrationCertificateFront = 'Registration certificate front is required';
    if (!vehicleData.registrationCertificateBack) newErrors.registrationCertificateBack = 'Registration certificate back is required';
    if (!vehicleData.vehiclePhoto) newErrors.vehiclePhoto = 'Vehicle photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();
      Object.keys(vehicleData).forEach(key => {
        if (vehicleData[key] !== null) {
          formData.append(key, vehicleData[key]);
        }
      });

      // Updated API call with proper CORS configuration
      const response = await fetch('http://localhost:8080/addVehicle', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'  // Explicitly set CORS mode
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Reset form
        setVehicleData({
          vehicleNumber: '',
          vehicleCategory: '',
          brand: '',
          modelType: '',
          fuelType: '',
          vehicleOwnership: '',
          registrationDate: '',
          insuranceValidTo: '',
          insuranceCopy: null,
          registrationCertificateFront: null,
          registrationCertificateBack: null,
          vehiclePhoto: null
        });
      } else {
        const errorMessage = await response.text();
        throw new Error(`Server error (${response.status}): ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      let errorMessage = 'Failed to add vehicle. ';
      
      if (error.message === 'Failed to fetch') {
        errorMessage += 'Unable to connect to the server. Please ensure the server is running and CORS is properly configured.';
      } else {
        errorMessage += error.message;
      }
      
      setErrors({ submit: errorMessage });
    }
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setVehicleData({
        ...vehicleData,
        [name]: files[0]
      });
    } else {
      setVehicleData({
        ...vehicleData,
        [name]: value
      });
    }
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
              name="vehicleNumber"
              value={vehicleData.vehicleNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.vehicleNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Category:
            </label>
            <input
              type="text"
              name="vehicleCategory"
              value={vehicleData.vehicleCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.vehicleCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleCategory}</p>
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
              name="modelType"
              value={vehicleData.modelType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.modelType && (
              <p className="text-red-500 text-sm mt-1">{errors.modelType}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type:
            </label>
            <input
              type="text"
              name="fuelType"
              value={vehicleData.fuelType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fuelType && (
              <p className="text-red-500 text-sm mt-1">{errors.fuelType}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Ownership:
            </label>
            <input
              type="text"
              name="vehicleOwnership"
              value={vehicleData.vehicleOwnership}
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
              name="registrationDate"
              value={vehicleData.registrationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.registrationDate && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationDate}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Valid To:
            </label>
            <input
              type="date"
              name="insuranceValidTo"
              value={vehicleData.insuranceValidTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.insuranceValidTo && (
              <p className="text-red-500 text-sm mt-1">{errors.insuranceValidTo}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Copy (PDF):
            </label>
            <input
              type="file"
              name="insuranceCopy"
              accept=".pdf"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.insuranceCopy && (
              <p className="text-red-500 text-sm mt-1">{errors.insuranceCopy}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Certificate Front (Image):
            </label>
            <input
              type="file"
              name="registrationCertificateFront"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.registrationCertificateFront && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationCertificateFront}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Certificate Back (Image):
            </label>
            <input
              type="file"
              name="registrationCertificateBack"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.registrationCertificateBack && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationCertificateBack}</p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Photo:
            </label>
            <input
              type="file"
              name="vehiclePhoto"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.vehiclePhoto && (
              <p className="text-red-500 text-sm mt-1">{errors.vehiclePhoto}</p>
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