import React, { useState } from 'react';

const PairingEmployees = () => {
  const [pairingData, setPairingData] = useState({
    employeeId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    purpose: ''
  });

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

  return (
    <div className="pairing-employees">
      <h1>Pair Employee with Vehicle</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Employee:</label>
          <select
            name="employeeId"
            value={pairingData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {/* Employee options will be populated from Redux store */}
          </select>
        </div>
        <div className="form-group">
          <label>Select Vehicle:</label>
          <select
            name="vehicleId"
            value={pairingData.vehicleId}
            onChange={handleChange}
            required
          >
            <option value="">Select Vehicle</option>
            {/* Vehicle options will be populated from Redux store */}
          </select>
        </div>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={pairingData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={pairingData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Purpose:</label>
          <textarea
            name="purpose"
            value={pairingData.purpose}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Pairing</button>
      </form>
    </div>
  );
};

export default PairingEmployees; 