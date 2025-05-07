import React, { useState } from 'react';

const AddDrivers = () => {
  const [driverData, setDriverData] = useState({
    driverName: '',
    mobileNumber: '',
    dateOfBirth: '',
    driverPhoto: null,
    licenseId: '',
    licenseExpiryDate: '',
    licenseFrontPhoto: null,
    licenseBackPhoto: null,
    idProofType: '',
    idProofFrontPhoto: null,
    idProofBackPhoto: null,
    pccForm: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Driver data:', driverData);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setDriverData({
      ...driverData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Driver</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Name */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver Name:
            </label>
            <input
              type="text"
              name="driverName"
              value={driverData.driverName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number:
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={driverData.mobileNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={driverData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Driver Photo */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver Photo:
            </label>
            <input
              type="file"
              name="driverPhoto"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>

          {/* License ID */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License ID No:
            </label>
            <input
              type="text"
              name="licenseId"
              value={driverData.licenseId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* License Expiry Date */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Expiry Date:
            </label>
            <input
              type="date"
              name="licenseExpiryDate"
              value={driverData.licenseExpiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* License Front Photo */}
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

          {/* License Back Photo */}
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

          {/* ID Proof Type */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Proof Type:
            </label>
            <select
              name="idProofType"
              value={driverData.idProofType}
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
          </div>

          {/* ID Proof Front Photo */}
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

          {/* ID Proof Back Photo */}
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

          {/* PCC Form */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PCC Form: (Optional)
            </label>
            <input
              type="file"
              name="pccForm"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.doc,.docx"
            />
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDrivers;