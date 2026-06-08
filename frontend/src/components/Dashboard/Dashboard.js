import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, getStats } from '../../services/api';
import StatsCards from './StatsCards';
import RecentApplications from './RecentApplications';
import ApplicationModal from '../Applications/ApplicationModal';
import './Dashboard.css';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        getApplications(),
        getStats()
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleApplicationAdded = () => {
    fetchData();
    setShowModal(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your job search progress</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Application
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="dashboard-content">
        <div className="section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/board">View All →</Link>
          </div>
          <RecentApplications 
            applications={applications.slice(0, 5)} 
            onUpdate={fetchData}
          />
        </div>
      </div>

      {showModal && (
        <ApplicationModal
          onClose={() => setShowModal(false)}
          onSave={handleApplicationAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;