import React, { useState } from 'react';

const PairingVehicle = () => {
  const [pairingData, setPairingData] = useState({
    driverId: '',
    vehicleId: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement vehicle-driver pairing logic
    console.log('Pairing data:', pairingData);
  };

  const handleChange = (e) => {
    setPairingData({
      ...pairingData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pairing-vehicle">
      <h1>Pair Vehicle with Driver</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Driver:</label>
          <select
            name="driverId"
            value={pairingData.driverId}
            onChange={handleChange}
            required
          >
            <option value="">Select Driver</option>
            {/* Driver options will be populated from Redux store */}
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
        <button type="submit">Create Pairing</button>
      </form>
    </div>
  );
};

export default PairingVehicle; 