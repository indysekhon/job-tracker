import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">🎯 Job Tracker</Link>
      </div>

      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={isActive('/dashboard') ? 'active' : ''}
        >
          Dashboard
        </Link>
        <Link 
          to="/board" 
          className={isActive('/board') ? 'active' : ''}
        >
          Kanban Board
        </Link>
        <Link 
          to="/analytics" 
          className={isActive('/analytics') ? 'active' : ''}
        >
          Analytics
        </Link>
      </div>

      <div className="nav-user">
        <span>👋 {user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;