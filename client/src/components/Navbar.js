import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// Add custom animations for the navbar
const navbarAnimations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .nav-item {
    animation: fadeIn 0.5s ease-out;
  }
  
  .dropdown-menu {
    animation: slideDown 0.3s ease-out;
  }
  
  .logout-btn:hover {
    animation: pulse 0.5s ease-in-out;
  }
  
  .nav-link:hover .nav-underline {
    width: 80% !important;
  }
  
  .dropdown-item:hover {
    background-color: rgba(0, 128, 128, 0.1);
  }
  
  body {
    padding-top: 70px;
  }
`;

// Add the animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(navbarAnimations));
document.head.appendChild(style);

const Navbar = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Debug user state
  useEffect(() => {
    console.log('Navbar - Current user state:', user);
  }, [user]);
  
  // Check if token exists but user is null
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      console.log('Token exists but user is null - possible auth issue');
      
      // Use the refreshUser function from AuthContext
      refreshUser().then(userData => {
        console.log('Manual refresh result in Navbar:', userData);
      });
    }
  }, [user, refreshUser]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  return (
    <nav 
      className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'shadow-sm' : ''}`} 
      style={{ 
        background: isScrolled 
          ? 'linear-gradient(90deg, rgba(0, 128, 128, 1) 0%, rgba(0, 102, 204, 1) 100%)' 
          : 'linear-gradient(90deg, rgba(0, 128, 128, 0.9) 0%, rgba(0, 102, 204, 0.9) 100%)',
        transition: 'all 0.3s ease',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        padding: isScrolled ? '0.5rem 1rem' : '1rem',
      }}
    >
      <div className="container">
        <Link 
          className="navbar-brand text-white" 
          to="/"
          style={{ 
            fontWeight: 'bold', 
            fontSize: isScrolled ? '1.3rem' : '1.5rem',
            transition: 'all 0.3s ease',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <i className="fas fa-hands-helping me-2"></i>
          Care Connect
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item" style={{ animationDelay: '0.1s' }}>
              <Link 
                className="nav-link text-white" 
                to="/"
                style={{ 
                  position: 'relative',
                  padding: '0.5rem 1rem',
                  margin: '0 0.2rem',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
              >
                <i className="fas fa-home me-1"></i> Home
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '50%', 
                    width: '0', 
                    height: '2px', 
                    background: 'white',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)'
                  }}
                  className="nav-underline"
                ></div>
              </Link>
            </li>
            <li className="nav-item" style={{ animationDelay: '0.2s' }}>
              <Link 
                className="nav-link text-white" 
                to="/about"
                style={{ 
                  position: 'relative',
                  padding: '0.5rem 1rem',
                  margin: '0 0.2rem',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
              >
                <i className="fas fa-info-circle me-1"></i> About
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '50%', 
                    width: '0', 
                    height: '2px', 
                    background: 'white',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)'
                  }}
                  className="nav-underline"
                ></div>
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li className="nav-item" style={{ animationDelay: '0.3s' }}>
                    <Link 
                      className="nav-link text-white" 
                      to="/admin"
                      style={{ 
                        position: 'relative',
                        padding: '0.5rem 1rem',
                        margin: '0 0.2rem',
                        transition: 'all 0.3s ease',
                        fontWeight: '500'
                      }}
                    >
                      <i className="fas fa-user-shield me-1"></i> Admin
                      <div 
                        style={{ 
                          position: 'absolute', 
                          bottom: '0', 
                          left: '50%', 
                          width: '0', 
                          height: '2px', 
                          background: 'white',
                          transition: 'all 0.3s ease',
                          transform: 'translateX(-50%)'
                        }}
                        className="nav-underline"
                      ></div>
                    </Link>
                  </li>
                )}
                <li className="nav-item" style={{ animationDelay: '0.4s' }}>
                  <Link 
                    className="nav-link text-white" 
                    to="/volunteer-cart"
                    style={{ 
                      position: 'relative',
                      padding: '0.5rem 1rem',
                      margin: '0 0.2rem',
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-hands-helping me-1"></i> My NGOs
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '50%', 
                        width: '0', 
                        height: '2px', 
                        background: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)'
                      }}
                      className="nav-underline"
                    ></div>
                  </Link>
                </li>
                <li className="nav-item" style={{ animationDelay: '0.5s' }}>
                  <Link 
                    className="nav-link text-white" 
                    to="/profile"
                    style={{ 
                      position: 'relative',
                      padding: '0.5rem 1rem',
                      margin: '0 0.2rem',
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-user-circle me-1"></i> {user?.name || 'Profile'}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '50%', 
                        width: '0', 
                        height: '2px', 
                        background: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)'
                      }}
                      className="nav-underline"
                    ></div>
                  </Link>
                </li>
                
                <li className="nav-item" style={{ animationDelay: '0.6s' }}>
                  <button 
                    className="nav-link text-white border-0 bg-transparent" 
                    onClick={handleLogout}
                    style={{ 
                      position: 'relative',
                      padding: '0.5rem 1rem',
                      margin: '0 0.2rem',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '50%', 
                        width: '0', 
                        height: '2px', 
                        background: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)'
                      }}
                      className="nav-underline"
                    ></div>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item" style={{ animationDelay: '0.3s' }}>
                  <Link 
                    className="nav-link text-white" 
                    to="/login"
                    style={{ 
                      position: 'relative',
                      padding: '0.5rem 1rem',
                      margin: '0 0.2rem',
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i> Login
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '50%', 
                        width: '0', 
                        height: '2px', 
                        background: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)'
                      }}
                      className="nav-underline"
                    ></div>
                  </Link>
                </li>
                <li className="nav-item" style={{ animationDelay: '0.4s' }}>
                  <Link 
                    className="nav-link text-white" 
                    to="/register"
                    style={{ 
                      position: 'relative',
                      padding: '0.5rem 1rem',
                      margin: '0 0.2rem',
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-user-plus me-1"></i> Register
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '50%', 
                        width: '0', 
                        height: '2px', 
                        background: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)'
                      }}
                      className="nav-underline"
                    ></div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 