import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('PrivateRoute: Path:', location.pathname);
  console.log('PrivateRoute: User state:', user);
  console.log('PrivateRoute: Loading state:', loading);
  
  // Check if token exists
  const token = localStorage.getItem('token');
  console.log('PrivateRoute: Token exists:', !!token);

  if (loading) {
    return (
      <div className="container mt-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" role="status" style={{ color: '#008080', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: '#008080', fontWeight: '500' }}>Verifying your authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('PrivateRoute: Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: Access granted');
  return children;
};

export default PrivateRoute; 