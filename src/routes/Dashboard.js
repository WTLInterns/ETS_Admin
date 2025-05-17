import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Sample data for the sessions chart
const sessionData = Array.from({ length: 30 }, (_, i) => ({
  date: `Apr ${i + 1}`,
  sessions: Math.floor(Math.random() * (15000 - 5000) + 5000),
  projected: Math.floor(Math.random() * (20000 - 10000) + 10000),
  baseline: Math.floor(Math.random() * (10000 - 2000) + 2000),
}));

// Sample data for the page views chart
const pageViewData = [
  { month: 'Jan', views: 5000, downloads: 3000 },
  { month: 'Feb', views: 7000, downloads: 4000 },
  { month: 'Mar', views: 5500, downloads: 3500 },
  { month: 'Apr', views: 6000, downloads: 4500 },
  { month: 'May', views: 7500, downloads: 4000 },
  { month: 'Jun', views: 6500, downloads: 3500 },
  { month: 'Jul', views: 5500, downloads: 3000 },
];

const Dashboard = () => {
  const drivers = useSelector(state => state.drivers);
  const employees = useSelector(state => state.employees);

  const [totalVehicles, setTotalVehicles] = useState();

  useEffect(() => {
    const fetchTotalVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/totalVehicles'); 
        console.log("Total Vehicles:", response);
        setTotalVehicles(response.data.data.totalVehicles);
      } catch (error) {
        console.error("Error fetching total vehicles:", error);
      }
    };

    fetchTotalVehicles();
  }, []);

  return (
    <div className="dashboard p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 mb-2">Users</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{drivers?.length || '14k'}</span>
            <span className="ml-2 text-sm text-green-500">+25%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          <div className="mt-4 h-16 bg-gradient-to-r from-green-100 to-green-50 rounded"></div>
        </div>
{/* 
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 mb-2">Conversions</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">325</span>
            <span className="ml-2 text-sm text-red-500">-25%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          <div className="mt-4 h-16 bg-gradient-to-r from-red-100 to-red-50 rounded"></div>
        </div> */}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 mb-2">Event count</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">200k</span>
            <span className="ml-2 text-sm text-blue-500">+5%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          <div className="mt-4 h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded"></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Vehicles</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              {totalVehicles !== null ? totalVehicles : 'Loading...'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">As per latest record</p>
          <div className="mt-4 h-16 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded"></div>
        </div>
      </div>

      {/* Bottom Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sessions Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <h3 className="text-sm text-gray-500">Sessions</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">13,277</span>
                <span className="ml-2 text-sm text-green-500">+35%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Sessions per day for the last 30 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#93c5fd"
                  fillOpacity={1}
                  fill="url(#colorProjected)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <h3 className="text-sm text-gray-500">Page views and downloads</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">1.3M</span>
                <span className="ml-2 text-sm text-red-500">-8%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Page views and downloads for the last 6 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageViewData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="downloads" stackId="a" fill="#3b82f6" />
                <Bar dataKey="views" stackId="a" fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
