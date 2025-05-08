import React, { useState } from 'react';

const AddEmployees = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    phone_number: '',
    gender: '',
    email: '',
    shift_time: '',
    pickup_location: '',
    drop_location: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!employeeData.name.trim()) newErrors.name = 'Name is required';
    if (!employeeData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) newErrors.email = 'Invalid email format';
    if (!employeeData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!/^\d{10}$/.test(employeeData.phone_number)) newErrors.phone_number = 'Phone number must be 10 digits';
    if (!employeeData.gender) newErrors.gender = 'Gender is required';
    if (!employeeData.shift_time) newErrors.shift_time = 'Shift time is required';
    if (!employeeData.pickup_location) newErrors.pickup_location = 'Pickup location is required';
    if (!employeeData.drop_location) newErrors.drop_location = 'Drop location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8080/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });

      if (response.ok) {
        setSuccessMessage('Employee added successfully!');
        // Reset form
        setEmployeeData({
          name: '',
          phone_number: '',
          gender: '',
          email: '',
          shift_time: '',
          pickup_location: '',
          drop_location: ''
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to add employee');
      }
    } catch (error) {
      setErrors({ submit: 'Failed to add employee. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Employee</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
            <input
              type="tel"
              name="phone_number"
              value={employeeData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender:</label>
            <select
              name="gender"
              value={employeeData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={employeeData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Shift Time:</label>
            <input
              type="text"
              name="shift_time"
              value={employeeData.shift_time}
              onChange={handleChange}
              placeholder="e.g. 9:00 AM - 6:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.shift_time && <p className="text-red-500 text-sm mt-1">{errors.shift_time}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location:</label>
            <input
              type="text"
              name="pickup_location"
              value={employeeData.pickup_location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.pickup_location && <p className="text-red-500 text-sm mt-1">{errors.pickup_location}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Drop Location:</label>
            <input
              type="text"
              name="drop_location"
              value={employeeData.drop_location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.drop_location && <p className="text-red-500 text-sm mt-1">{errors.drop_location}</p>}
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployees;