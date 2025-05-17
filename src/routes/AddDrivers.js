import React, { useState } from 'react';

const AddDrivers = () => {
  const [driverData, setDriverData] = useState({
    name: '',
    mobile: '',
    data_of_birth: '',
    license_id_number: '',
    license_expire_date: '',
    select_id_proof: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!driverData.name) newErrors.name = 'Name is required';
    if (!driverData.mobile) newErrors.mobile = 'Mobile number is required';
    if (!driverData.data_of_birth) newErrors.data_of_birth = 'Date of birth is required';
    if (!driverData.license_id_number) newErrors.license_id_number = 'License ID is required';
    if (!driverData.license_expire_date) newErrors.license_expire_date = 'License expiry date is required';
    if (!driverData.select_id_proof) newErrors.select_id_proof = 'ID proof type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(driverData).forEach(key => {
        if (driverData[key] !== null) {
          formData.append(key, driverData[key]);
        }
      });

      // Add file fields with error handling
      const fileFields = {
        license_front_photo: document.querySelector('input[name="licenseFrontPhoto"]').files[0],
        license_back_photo: document.querySelector('input[name="licenseBackPhoto"]').files[0],
        id_proof_front_photo: document.querySelector('input[name="idProofFrontPhoto"]').files[0],
        id_proof_back_photo: document.querySelector('input[name="idProofBackPhoto"]').files[0],
        pcc_document: document.querySelector('input[name="pccForm"]').files[0]
      };

      // Validate file uploads
      for (const [key, file] of Object.entries(fileFields)) {
        if (!file) {
          throw new Error(`Please select a file for ${key.replace(/_/g, ' ')}`);
        }
        formData.append(key, file);
      }

      const response = await fetch('http://localhost:8080/addDriver', {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Reset form
        setDriverData({
          name: '',
          mobile: '',
          data_of_birth: '',
          license_id_number: '',
          license_expire_date: '',
          select_id_proof: ''
        });
        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = '';
        });
        setErrors({}); // Clear any existing errors
      } else {
        // Handle server-side validation errors or other error messages
        const errorMessage = data.message || 'Failed to add driver';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      // Set a more user-friendly error message
      setErrors({ 
        submit: error.message || 'Failed to add driver. Please check your form data and try again.' 
      });
      // Scroll to the error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Driver</h1>
        
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            Driver added successfully!
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver Name:
            </label>
            <input
              type="text"
              name="name"
              value={driverData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number:
            </label>
            <input
              type="tel"
              name="mobile"
              value={driverData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth:
            </label>
            <input
              type="date"
              name="data_of_birth"
              value={driverData.data_of_birth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.data_of_birth && <p className="text-red-500 text-sm mt-1">{errors.data_of_birth}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License ID No:
            </label>
            <input
              type="text"
              name="license_id_number"
              value={driverData.license_id_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.license_id_number && <p className="text-red-500 text-sm mt-1">{errors.license_id_number}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Expiry Date:
            </label>
            <input
              type="date"
              name="license_expire_date"
              value={driverData.license_expire_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.license_expire_date && <p className="text-red-500 text-sm mt-1">{errors.license_expire_date}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Proof Type:
            </label>
            <select
              name="select_id_proof"
              value={driverData.select_id_proof}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select ID Proof</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="voter">Voter ID</option>
              <option value="passport">Passport</option>
            </select>
            {errors.select_id_proof && <p className="text-red-500 text-sm mt-1">{errors.select_id_proof}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Front Photo:
            </label>
            <input
              type="file"
              name="licenseFrontPhoto"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Back Photo:
            </label>
            <input
              type="file"
              name="licenseBackPhoto"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Proof Front Photo:
            </label>
            <input
              type="file"
              name="idProofFrontPhoto"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Proof Back Photo:
            </label>
            <input
              type="file"
              name="idProofBackPhoto"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PCC Document:
            </label>
            <input
              type="file"
              name="pccForm"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.doc,.docx"
              required
            />
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDrivers;