import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Add custom animations for the profile page
const profileAnimations = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 5px 15px rgba(0, 128, 128, 0.2);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 10px 25px rgba(0, 128, 128, 0.3);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 5px 15px rgba(0, 128, 128, 0.2);
    }
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .profile-card {
    animation: fadeInUp 0.8s ease-out, pulse 5s ease-in-out infinite;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .profile-header {
    background: linear-gradient(135deg, rgba(128, 244, 78, 0.2) 0%, rgba(78, 219, 244, 0.2) 100%);
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
    padding: 20px;
    border-bottom: 1px solid rgba(128, 244, 78, 0.2);
  }
  
  .profile-title {
    background: linear-gradient(90deg, #008080, #0066CC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    position: relative;
  }
  
  .profile-input {
    transition: all 0.3s ease;
    border: 1px solid rgba(128, 244, 78, 0.3);
  }
  
  .profile-input:focus {
    border-color: #4edbf4;
    box-shadow: 0 0 0 0.25rem rgba(78, 219, 244, 0.25);
    transform: translateY(-2px);
  }
  
  .profile-label {
    color: #008080;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .profile-button {
    background: linear-gradient(135deg, #008080 0%, #0066CC 100%);
    border: none;
    color: white;
    padding: 12px 25px;
    border-radius: 25px;
    box-shadow: 0 4px 15px rgba(0, 102, 204, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .profile-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 128, 128, 0.3);
  }
  
  .profile-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid white;
    box-shadow: 0 5px 15px rgba(0, 128, 128, 0.3);
    transition: all 0.3s ease;
  }
  
  .profile-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 128, 128, 0.4);
  }
`;

// Add the animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(profileAnimations));
document.head.appendChild(style);

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    try {
      // Store the user's name before logout for the toast message
      const userName = user?.name || 'User';
      
      const result = logout();
      
      if (result) {
        toast.success(
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              Goodbye, {userName}!
            </div>
            <div>
              You have been successfully logged out.
            </div>
          </div>, 
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: '👋',
          }
        );
        
        // Add a small delay before navigation for better UX
        setTimeout(() => {
          navigate('/');
        }, 300);
      } else {
        toast.error('There was an issue logging out. Please try again.', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error in handleLogout:', error);
      toast.error('An unexpected error occurred. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" role="status" style={{ color: '#008080', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: '#008080', fontWeight: '500' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card profile-card">
            <div className="profile-header">
              <h2 className="text-center mb-0 profile-title">
                My Profile
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '25%',
                  width: '50%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #008080, #0066CC)',
                  borderRadius: '2px',
                  animation: 'gradientShift 3s ease infinite'
                }}></div>
              </h2>
            </div>
            <div className="card-body p-4">
              {/* Animated floating elements */}
              <div style={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.4) 0%, rgba(78, 219, 244, 0.4) 100%)',
                animation: 'pulse 4s ease-in-out infinite',
                zIndex: 1
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '10%',
                width: '20px',
                height: '20px',
                borderRadius: '8px',
                transform: 'rotate(45deg)',
                background: 'linear-gradient(135deg, rgba(78, 219, 244, 0.3) 0%, rgba(128, 244, 78, 0.3) 100%)',
                animation: 'pulse 5s ease-in-out infinite 0.5s',
                zIndex: 1
              }}></div>
              
              <div className="text-center mb-4" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=150`} 
                  alt={user.name} 
                  className="profile-avatar mb-3"
                />
                <h3 style={{ color: '#008080' }}>{user.name}</h3>
                <p className="text-muted">{user.email}</p>
                <div className="badge bg-primary" style={{ 
                  padding: '8px 15px', 
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
                }}>
                  <i className="fas fa-user me-2"></i>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
              
              <div className="row mb-4" style={{ animation: 'fadeInUp 0.7s ease-out' }}>
                <div className="col-md-6 mb-3">
                  <div className="p-3" style={{ 
                    background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.1) 0%, rgba(78, 219, 244, 0.1) 100%)',
                    borderRadius: '10px',
                    height: '100%'
                  }}>
                    <h5 style={{ color: '#008080' }}>
                      <i className="fas fa-info-circle me-2"></i>
                      Account Info
                    </h5>
                    <p className="mb-2">
                      <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mb-0">
                      <strong>Last Login:</strong> {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="p-3" style={{ 
                    background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.1) 0%, rgba(78, 219, 244, 0.1) 100%)',
                    borderRadius: '10px',
                    height: '100%'
                  }}>
                    <h5 style={{ color: '#008080' }}>
                      <i className="fas fa-hands-helping me-2"></i>
                      Volunteer Stats
                    </h5>
                    <p className="mb-2">
                      <strong>NGOs Supported:</strong> {user.volunteerCount || 0}
                    </p>
                    <p className="mb-0">
                      <strong>Status:</strong> {user.volunteerStatus || 'Active'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                <button 
                  className="btn profile-button"
                  onClick={() => navigate('/volunteer-cart')}
                >
                  <i className="fas fa-hands-helping me-2"></i>
                  My NGOs
                </button>
                
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                  style={{ 
                    borderRadius: '25px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Shine effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
                    transform: 'translateX(-100%)',
                    animation: 'shine 3s infinite'
                  }}></div>
                  
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
              
              <div className="text-center mt-4" style={{ animation: 'fadeInUp 0.9s ease-out' }}>
                <p className="text-muted">
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    You can also logout by clicking the Logout button in the navigation bar.
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;