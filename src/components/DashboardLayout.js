import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaUserCircle, FaCar, FaUsers, FaTruck, FaExchangeAlt, FaUserPlus, FaBars } from 'react-icons/fa';

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaUserCircle /> },
];

const applicationLinks = [
  { to: '/AddDrivers', label: 'Add Drivers', icon: <FaCar /> },
  { to: '/drivers', label: 'Drivers', icon: <FaCar /> },
  { to: '/addvehicles', label: 'Add Vehicles', icon: <FaTruck /> },
  { to: '/vehicles', label: 'Vehicles', icon: <FaTruck /> },
  { to: '/pairingvehicle', label: 'Pairing Vehicle', icon: <FaExchangeAlt /> },
  { to: '/addEmployees', label: 'Add Employees', icon: <FaUserPlus /> },
  { to: '/employees', label: 'Employees', icon: <FaUsers /> },
  { to: '/pairingemployees', label: 'Pairing Employees', icon: <FaExchangeAlt /> },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open sidebar"
      >
        <FaBars className="text-2xl text-blue-600" />
      </button>
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 px-4 py-6
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200 ease-in-out
          md:static md:translate-x-0 md:flex-shrink-0
        `}
        style={{ minHeight: '100vh' }}
      >
        {/* User Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <FaUserCircle className="text-blue-500 text-4xl" />
          </div>
          <div className="text-lg font-semibold text-gray-800">ETS Admin</div>
        </div>
        {/* Dashboards Section */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 uppercase px-3 mb-2">Dashboards</div>
          <ul className="space-y-1">
            {dashboardLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Application Views Section */}
        <div>
          <div className="text-xs text-gray-400 uppercase px-3 mb-2">Application Views</div>
          <ul className="space-y-1">
            {applicationLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;