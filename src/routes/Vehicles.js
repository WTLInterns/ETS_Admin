import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaBan, FaTimes, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlacklisted, setShowBlacklisted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        showBlacklisted 
          ? 'http://localhost:8080/getBlockVehicles'
          : 'http://localhost:8080/getVehicles'
      );

      setVehicles(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [showBlacklisted]);

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditFormData({
      vehicle_number: vehicle.vehicle_number || '',
      vehicle_category: vehicle.vehicle_category || '',
      brand: vehicle.brand || '',
      model_type: vehicle.model_type || '',
      fuel_type: vehicle.fuel_type || '',
      vehicle_ownership: vehicle.vehicle_ownership || '',
      registration_date: vehicle.registration_date || '',
      insurance_valid: vehicle.insurance_valid || '',
      insuranceCopy: null,
      registrationCertificate: null,
      vehiclePhoto: null
    });
    setFormErrors({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: files[0]
    });
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'vehicle_number', 'vehicle_category', 'brand', 
      'model_type', 'fuel_type', 'vehicle_ownership',
      'registration_date', 'insurance_valid'
    ];

    requiredFields.forEach(field => {
      if (!editFormData[field]) {
        errors[field] = 'This field is required';
      }
    });

    // Validate vehicle number format (example: MH12AB1234)
    const vehicleNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (editFormData.vehicle_number && !vehicleNumberRegex.test(editFormData.vehicle_number)) {
      errors.vehicle_number = 'Invalid format (e.g. MH12AB1234)';
    }

    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (editFormData.registration_date && !dateRegex.test(editFormData.registration_date)) {
      errors.registration_date = 'Invalid date format (YYYY-MM-DD)';
    }
    if (editFormData.insurance_valid && !dateRegex.test(editFormData.insurance_valid)) {
      errors.insurance_valid = 'Invalid date format (YYYY-MM-DD)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      });

      const response = await axios.put(
        `http://localhost:8080/updateVehicle/${editingVehicle.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        fetchVehicles(); // Refresh the list
        setEditingVehicle(null); // Close the modal
      } else {
        setError('Failed to update vehicle');
      }
    } catch (err) {
      setError('Error updating vehicle: ' + err.message);
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlacklistToggle = async (vehicleId) => {
    try {
      const endpoint = showBlacklisted 
        ? `http://localhost:8080/unblockVehicle/${vehicleId}`
        : `http://localhost:8080/blockVehicle/${vehicleId}`;
      
      const response = await axios.put(endpoint);
      
      if (response.data.success) {
        fetchVehicles(); // Refresh the list
      } else {
        setError(`Failed to ${showBlacklisted ? 'unblock' : 'block'} vehicle`);
      }
    } catch (err) {
      setError(`Error ${showBlacklisted ? 'unblocking' : 'blocking'} vehicle: ${err.message}`);
      console.error('Blacklist toggle error:', err);
    }
  };

  const filteredVehicles = (vehicles || []).filter(vehicle => {
    if (!searchQuery) return true;
    
    return (
      vehicle?.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.vehicle_category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header and Search */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No vehicles found
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicle_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.vehicle_category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.fuel_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(vehicle)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                          >
                            <FaEdit size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleBlacklistToggle(vehicle.id)}
                            className={`${showBlacklisted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1 rounded-md flex items-center gap-1`}
                          >
                            {showBlacklisted ? <FaCheck size={14} /> : <FaBan size={14} />}
                            {showBlacklisted ? 'Unblock' : 'Block'}
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

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Vehicle Details</h2>
                <button 
                  onClick={() => setEditingVehicle(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number*
                    </label>
                    <input
                      type="text"
                      name="vehicle_number"
                      value={editFormData.vehicle_number}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.vehicle_number ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. MH12AB1234"
                    />
                    {formErrors.vehicle_number && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_number}</p>
                    )}
                  </div>

                  {/* Vehicle Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Category*
                    </label>
                    <select
                      name="vehicle_category"
                      value={editFormData.vehicle_category}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.vehicle_category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Category</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Tempo Traveller">Tempo Traveller</option>
                    </select>
                    {formErrors.vehicle_category && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_category}</p>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand*
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={editFormData.brand}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.brand ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. Toyota, Honda"
                    />
                    {formErrors.brand && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
                    )}
                  </div>

                  {/* Model Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model Type*
                    </label>
                    <input
                      type="text"
                      name="model_type"
                      value={editFormData.model_type}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.model_type ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. Innova, Swift"
                    />
                    {formErrors.model_type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.model_type}</p>
                    )}
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type*
                    </label>
                    <select
                      name="fuel_type"
                      value={editFormData.fuel_type}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.fuel_type ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {formErrors.fuel_type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.fuel_type}</p>
                    )}
                  </div>

                  {/* Vehicle Ownership */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Ownership*
                    </label>
                    <select
                      name="vehicle_ownership"
                      value={editFormData.vehicle_ownership}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.vehicle_ownership ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Ownership</option>
                      <option value="Owned">Owned</option>
                      <option value="Rented">Rented</option>
                      <option value="Leased">Leased</option>
                    </select>
                    {formErrors.vehicle_ownership && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_ownership}</p>
                    )}
                  </div> */}

                  {/* Registration Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Date*
                    </label>
                    <input
                      type="date"
                      name="registration_date"
                      value={editFormData.registration_date}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.registration_date ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.registration_date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.registration_date}</p>
                    )}
                  </div>

                  {/* Insurance Valid Up To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Valid Up To*
                    </label>
                    <input
                      type="date"
                      name="insurance_valid"
                      value={editFormData.insurance_valid}
                      onChange={handleEditFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.insurance_valid ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.insurance_valid && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.insurance_valid}</p>
                    )}
                  </div>

                  {/* Document Uploads */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Insurance Copy
                        </label>
                        <input
                          type="file"
                          name="insuranceCopy"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {editingVehicle.insuranceCopy && (
                          <a 
                            href={editingVehicle.insuranceCopy} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm mt-1 inline-block hover:underline"
                          >
                            View current file
                          </a>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Certificate
                        </label>
                        <input
                          type="file"
                          name="registrationCertificate"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {editingVehicle.registrationCertificate && (
                          <a 
                            href={editingVehicle.registrationCertificate} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm mt-1 inline-block hover:underline"
                          >
                            View current file
                          </a>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Photo
                        </label>
                        <input
                          type="file"
                          name="vehiclePhoto"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          accept=".jpg,.jpeg,.png"
                        />
                        {editingVehicle.vehiclePhoto && (
                          <a 
                            href={editingVehicle.vehiclePhoto} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm mt-1 inline-block hover:underline"
                          >
                            View current photo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingVehicle(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;