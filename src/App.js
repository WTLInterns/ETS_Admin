import React from "react";
import "./index.css";

import Dashboard from "./routes/Dashboard"
import AddDrivers from "./routes/AddDrivers"
import Drivers from "./routes/Drivers"
import AddVehicles from "./routes/AddVehicles"
import Vehicles from "./routes/Vehicles";
import { Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import PairingVehicle from "./routes/PairingVehicle"
import AddEmployees from "./routes/AddEmployees"
import Employees from "./routes/Employees";
import PairingEmployees from "./routes/PairingEmployees";
import Login from "./components/loginPages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
const App = () => {
  return (
    <Provider store={appStore}>
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="AddDrivers" element={<AddDrivers />} />
    <Route path="drivers" element={<Drivers />} />
    <Route path="addvehicles" element={<AddVehicles />} />
    <Route path="vehicles" element={<Vehicles />} />
    <Route path="pairingvehicle" element={<PairingVehicle />} />
    <Route path="addEmployees" element={<AddEmployees />} />
    <Route path="employees" element={<Employees />} />
    <Route path="pairingemployees" element={<PairingEmployees />} />
    <Route index element={<Dashboard />} /> {/* Default page */}
  </Route>
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
    </Provider>
  );
};

export default App;
