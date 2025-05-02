import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Add custom animations for the login page
const loginAnimations = `
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
  
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .login-card {
    animation: fadeInUp 0.8s ease-out, pulse 5s ease-in-out infinite;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .login-header {
    background: linear-gradient(135deg, rgba(128, 244, 78, 0.2) 0%, rgba(78, 219, 244, 0.2) 100%);
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
    padding: 20px;
    border-bottom: 1px solid rgba(128, 244, 78, 0.2);
  }
  
  .login-title {
    background: linear-gradient(90deg, #008080, #0066CC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    position: relative;
  }
  
  .login-input {
    transition: all 0.3s ease;
    border: 1px solid rgba(128, 244, 78, 0.3);
  }
  
  .login-input:focus {
    border-color: #4edbf4;
    box-shadow: 0 0 0 0.25rem rgba(78, 219, 244, 0.25);
    transform: translateY(-2px);
  }
  
  .login-label {
    color: #008080;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .login-button {
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
  
  .login-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 128, 128, 0.3);
  }
`;

// Add the animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(loginAnimations));
document.head.appendChild(style);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form data
      if (!email || !password) {
        throw new Error('Please provide both email and password');
      }
      
      console.log('Attempting login with:', formData);
      
      // Call the login function from AuthContext
      const response = await login(formData);
      console.log('Login response:', response);
      
      if (!response || !response.userData) {
        console.error('Invalid login response structure:', response);
        throw new Error('Invalid login response');
      }
      
      // Check if token is stored in localStorage
      const token = localStorage.getItem('token');
      console.log('Token stored in localStorage after login:', token ? 'Yes' : 'No');
      
      const userName = response.userData?.name || 'User';
      console.log('User name from response:', userName);
      
      // Show welcome popup with user's name
      toast.success(
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
            Welcome to CareConnect, {userName}!
          </div>
          <div>
            Thank you for joining our community of changemakers.
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: '👋',
        }
      );
      
      // Add a delay before navigation to ensure state is updated
      console.log('Preparing to navigate to:', from?.pathname || '/');
      
      // Double-check user state with manual refresh
      setTimeout(async () => {
        console.log('Performing manual refresh before navigation');
        const refreshedUser = await refreshUser();
        console.log('Refreshed user before navigation:', refreshedUser);
        
        console.log('Navigating to:', from?.pathname || '/');
        navigate(from || '/', { replace: true });
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error logging in';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card login-card">
            <div className="login-header">
              <h2 className="text-center mb-0 login-title">
                Login to CareConnect
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
              
              {error && (
                <div className="alert alert-danger" role="alert" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={onSubmit} style={{ position: 'relative', zIndex: 2 }}>
                <div className="mb-4" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                  <label htmlFor="email" className="form-label login-label">
                    <i className="fas fa-envelope me-2" style={{ color: '#008080' }}></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control login-input"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    disabled={loading}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="mb-4" style={{ animation: 'fadeInUp 0.7s ease-out' }}>
                  <label htmlFor="password" className="form-label login-label">
                    <i className="fas fa-lock me-2" style={{ color: '#0066CC' }}></i>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control login-input"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    disabled={loading}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="mb-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      style={{ 
                        borderColor: 'rgba(0, 128, 128, 0.3)',
                        cursor: 'pointer'
                      }}
                    />
                    <label className="form-check-label" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                      Remember me
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-100 login-button"
                  disabled={loading}
                  style={{ animation: 'fadeInUp 0.9s ease-out' }}
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
                  
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </>
                  )}
                </button>
                
                <div className="text-center mt-4" style={{ animation: 'fadeInUp 1s ease-out' }}>
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ 
                      color: '#008080',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Register here
                    </Link>
                  </p>
                </div>
                
                <div className="text-center mt-3" style={{ animation: 'fadeInUp 1.1s ease-out' }}>
                  <Link to="/forgot-password" style={{ 
                    color: '#666',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 