import React from 'react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { label: 'Total Applications', value: stats.total, icon: '📋', color: '#667eea' },
    { label: 'Applied', value: stats.applied, icon: '📤', color: '#3498db' },
    { label: 'Interviews', value: stats.interview, icon: '💬', color: '#f39c12' },
    { label: 'Offers', value: stats.offer, icon: '🎉', color: '#27ae60' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', color: '#e74c3c' },
    { 
      label: 'Response Rate', 
      value: stats.total > 0 ? `${Math.round((stats.responses / stats.total) * 100)}%` : '0%', 
      icon: '📊', 
      color: '#9b59b6' 
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card" style={{ borderTopColor: card.color }}>
          <span className="stat-icon">{card.icon}</span>
          <div className="stat-info">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;