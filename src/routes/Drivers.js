import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaBan, FaTimes, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const Drivers = () => {
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [blockedDrivers, setBlockedDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, [showBlocked]); // Add showBlocked as dependency to refetch when toggling

  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        showBlocked 
          ? 'http://localhost:8080/getBlockDrivers'
          : 'http://localhost:8080/getDrivers'
      );
      
      const { success, data, message } = response.data;
      
      if (success) {
        if (showBlocked) {
          setBlockedDrivers(data || []);
          setActiveDrivers([]); // Clear active drivers when showing blocked
        } else {
          // For active drivers, filter out any blacklisted ones
          const active = (data || []).filter(driver => !driver.black_list);
          setActiveDrivers(active);
          setBlockedDrivers([]); // Clear blocked drivers when showing active
        }
        setError(null);
      } else {
        throw new Error(message || 'Failed to fetch drivers');
      }
    } catch (err) {
      setError('Failed to fetch drivers. Please try again later.');
      console.error('Error fetching drivers:', err);
      if (showBlocked) {
        setBlockedDrivers([]);
      } else {
        setActiveDrivers([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update the filtered list to match backend field names
  const drivers = showBlocked ? blockedDrivers : activeDrivers;
  
  const filteredDrivers = drivers.filter(driver => {
    if (!driver) return false;
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const name = String(driver?.name || '').toLowerCase();
    const mobile = String(driver?.mobile || '');
    const license = String(driver?.license_id_number || '').toLowerCase();
    
    return name.includes(searchLower) || 
           mobile.includes(searchQuery) || 
           license.includes(searchLower);
  });

  // Edit logic
  const handleEditClick = (driver) => {
    setEditingDriver({ ...driver });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:8080/update/driver/${editingDriver._id}`, 
        editingDriver
      );
      
      if (response.data.success) {
        // Update the local state with the edited driver
        if (showBlocked) {
          setBlockedDrivers(blockedDrivers.map(d => 
            d._id === editingDriver._id ? response.data.data : d
          ));
        } else {
          setActiveDrivers(activeDrivers.map(d => 
            d._id === editingDriver._id ? response.data.data : d
          ));
        }
        setIsEditModalOpen(false);
        setEditingDriver(null);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to update driver');
      }
    } catch (err) {
      setError('Failed to update driver: ' + (err.response?.data?.message || err.message));
      console.error('Error updating driver:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Block logic
  const handleBlock = (driver) => {
    setActiveDrivers(activeDrivers.filter(d => d.id !== driver.id));
    setBlockedDrivers([...blockedDrivers, driver]);
  };

  // Unblock logic (optional)
  const handleUnblock = (driver) => {
    setBlockedDrivers(blockedDrivers.filter(d => d.id !== driver.id));
    setActiveDrivers([...activeDrivers, driver]);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {showBlocked ? "Blocked Drivers" : "Driver List"}
          </h1>
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${showBlocked ? "bg-gray-300 text-gray-700" : "bg-red-500 hover:bg-red-600 text-white"}`}
            onClick={() => setShowBlocked(!showBlocked)}
          >
            {showBlocked ? <FaArrowLeft /> : <FaBan />}
            {showBlocked ? "Back to Active" : "Show Blocked Drivers"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name, Mobile or License ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading drivers...</p>
          </div>
        ) : (
          <>
            {/* Drivers Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Proof Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drivers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No drivers found
                      </td>
                    </tr>
                  ) : (
                    drivers.map((driver, index) => (
                      <tr key={driver._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.mobile}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.data_of_birth}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.license_id_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.license_expire_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.select_id_proof}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(driver)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                            >
                              <FaEdit className="text-sm" /> Edit
                            </button>
                            {showBlocked ? (
                              <button
                                onClick={() => handleUnblock(driver)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlock(driver)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                              >
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Edit Driver</h2>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driver Name
                      </label>
                      <input
                        type="text"
                        value={editingDriver?.name || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={editingDriver?.mobile || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, mobile: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editingDriver?.data_of_birth || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, data_of_birth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License ID
                      </label>
                      <input
                        type="text"
                        value={editingDriver?.license_id_number || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, license_id_number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Expiry Date
                      </label>
                      <input
                        type="date"
                        value={editingDriver?.license_expire_date || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, license_expire_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Proof Type
                      </label>
                      <select
                        value={editingDriver?.select_id_proof || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, select_id_proof: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select ID Proof</option>
                        <option value="Passport">Passport</option>
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Drivers;