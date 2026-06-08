import React from 'react';

const ApplicationCard = ({ application, isDragging, onClick }) => {
  return (
    <div 
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      <h4>{application.company}</h4>
      <p className="position">{application.position}</p>
      
      {application.salary_max && (
        <p className="salary">
          💰 ${application.salary_min?.toLocaleString()} - ${application.salary_max?.toLocaleString()}
        </p>
      )}
      
      {application.applied_date && (
        <p className="date">
          📅 {new Date(application.applied_date).toLocaleDateString()}
        </p>
      )}
      
      {application.notes && (
        <p className="notes">📝 {application.notes.substring(0, 50)}...</p>
      )}
    </div>
  );
};

export default ApplicationCard;