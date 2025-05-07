import React, { useState } from 'react';

const AddEmployees = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joiningDate: '',
    profilePhoto: null,
    idProof: null,
    addressProof: null
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!employeeData.name.trim()) newErrors.name = 'Name is required';
    if (!employeeData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) newErrors.email = 'Invalid email format';
    if (!employeeData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(employeeData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!employeeData.department) newErrors.department = 'Department is required';
    if (!employeeData.position.trim()) newErrors.position = 'Position is required';
    if (!employeeData.joiningDate) newErrors.joiningDate = 'Joining date is required';

    // Image validations
    if (!employeeData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    if (!employeeData.idProof) newErrors.idProof = 'ID proof is required';
    if (!employeeData.addressProof) newErrors.addressProof = 'Address proof is required';

    // File size validations (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (employeeData.profilePhoto && employeeData.profilePhoto.size > maxSize) {
      newErrors.profilePhoto = 'Profile photo size should be less than 5MB';
    }
    if (employeeData.idProof && employeeData.idProof.size > maxSize) {
      newErrors.idProof = 'ID proof size should be less than 5MB';
    }
    if (employeeData.addressProof && employeeData.addressProof.size > maxSize) {
      newErrors.addressProof = 'Address proof size should be less than 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      Object.keys(employeeData).forEach(key => {
        formData.append(key, employeeData[key]);
      });

      // TODO: Replace with your API endpoint
      const response = await fetch('http://localhost:8080/addEmployee', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSuccessMessage('Employee added successfully!');
        // Reset form
        setEmployeeData({
          name: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          joiningDate: '',
          profilePhoto: null,
          idProof: null,
          addressProof: null
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
    const { name, value, files } = e.target;
    if (files) {
      setEmployeeData({
        ...employeeData,
        [name]: files[0]
      });
    } else {
      setEmployeeData({
        ...employeeData,
        [name]: value
      });
    }
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone:</label>
            <input
              type="tel"
              name="phone"
              value={employeeData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
            <select
              name="department"
              value={employeeData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="operations">Operations</option>
              <option value="maintenance">Maintenance</option>
              <option value="administration">Administration</option>
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Position:</label>
            <input
              type="text"
              name="position"
              value={employeeData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date:</label>
            <input
              type="date"
              name="joiningDate"
              value={employeeData.joiningDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.joiningDate && <p className="text-red-500 text-sm mt-1">{errors.joiningDate}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo:</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof:</label>
            <input
              type="file"
              name="idProof"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.idProof && <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Proof:</label>
            <input
              type="file"
              name="addressProof"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.addressProof && <p className="text-red-500 text-sm mt-1">{errors.addressProof}</p>}
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