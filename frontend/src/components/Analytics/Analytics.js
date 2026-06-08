import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell } from 'recharts';
import { getStats, getApplications } from '../../services/api';
import './Analytics.css';

const COLORS = ['#95a5a6', '#3498db', '#f39c12', '#27ae60', '#e74c3c'];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        getStats(),
        getApplications()
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const pieData = [
    { name: 'Wishlist', value: parseInt(stats?.wishlist) || 0 },
    { name: 'Applied', value: parseInt(stats?.applied) || 0 },
    { name: 'Interview', value: parseInt(stats?.interview) || 0 },
    { name: 'Offer', value: parseInt(stats?.offer) || 0 },
    { name: 'Rejected', value: parseInt(stats?.rejected) || 0 },
  ].filter(item => item.value > 0);

  // Applications by month
  const monthlyData = applications.reduce((acc, app) => {
    if (app.applied_date) {
      const month = new Date(app.applied_date).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  const barData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    applications: count
  })).slice(-6); // Last 6 months

  const responseRate = stats?.total > 0 
    ? Math.round((stats.responses / stats.total) * 100) 
    : 0;

  const avgResponseDays = stats?.avg_response_days 
    ? Math.round(stats.avg_response_days) 
    : 'N/A';

  return (
    <div className="analytics">
      <h1>Analytics</h1>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="analytics-card metrics">
          <h2>Key Metrics</h2>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-value">{stats?.total || 0}</span>
              <span className="metric-label">Total Applications</span>
            </div>
            <div className="metric">
              <span className="metric-value">{responseRate}%</span>
              <span className="metric-label">Response Rate</span>
            </div>
            <div className="metric">
              <span className="metric-value">{avgResponseDays}</span>
              <span className="metric-label">Avg. Days to Response</span>
            </div>
            <div className="metric">
              <span className="metric-value">{stats?.interview || 0}</span>
              <span className="metric-label">Interviews Scheduled</span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="analytics-card">
          <h2>Status Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No data yet</p>
          )}
        </div>

        {/* Monthly Applications */}
        <div className="analytics-card wide">
          <h2>Applications Over Time</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#667eea" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No application dates recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;