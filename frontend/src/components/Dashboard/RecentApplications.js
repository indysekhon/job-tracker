import React from 'react';
import { deleteApplication } from '../../services/api';

const statusColors = {
  wishlist: '#95a5a6',
  applied: '#3498db',
  interview: '#f39c12',
  offer: '#27ae60',
  rejected: '#e74c3c'
};

const RecentApplications = ({ applications, onUpdate }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <p>No applications yet. Start tracking your job search!</p>
      </div>
    );
  }

  return (
    <div className="applications-list">
      {applications.map((app) => (
        <div key={app.id} className="application-row">
          <div className="app-main">
            <h3>{app.company}</h3>
            <p>{app.position}</p>
          </div>
          <div className="app-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: statusColors[app.status] }}
            >
              {app.status}
            </span>
          </div>
          <div className="app-date">
            {app.applied_date 
              ? new Date(app.applied_date).toLocaleDateString() 
              : 'Not applied yet'}
          </div>
          <div className="app-actions">
            <button className="btn-delete" onClick={() => handleDelete(app.id)}>
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentApplications;