import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Add custom animations for the volunteer form
const animations = `
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
      opacity: 0.6;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
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
  
  .volunteer-input {
    transition: all 0.3s ease;
    border: 1px solid rgba(128, 244, 78, 0.3);
  }
  
  .volunteer-input:focus {
    border-color: #4edbf4;
    box-shadow: 0 0 0 0.25rem rgba(78, 219, 244, 0.25);
    transform: translateY(-2px);
  }
  
  .volunteer-label {
    color: #008080;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .volunteer-card {
    animation: fadeInUp 0.8s ease-out;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .volunteer-header {
    background: linear-gradient(135deg, rgba(128, 244, 78, 0.2) 0%, rgba(78, 219, 244, 0.2) 100%);
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
    padding: 20px;
    border-bottom: 1px solid rgba(128, 244, 78, 0.2);
  }
  
  .volunteer-title {
    background: linear-gradient(90deg, #80f44e, #4edbf4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    position: relative;
  }
  
  .volunteer-button {
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
  
  .volunteer-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 128, 128, 0.3);
  }
`;

// Add the animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(animations));
document.head.appendChild(style);

const Volunteer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNGO } = useNGO();
  const { user } = useAuth();
  const [ngo, setNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    availability: '',
    interests: ''
  });

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        console.log('Volunteer: Fetching NGO with ID:', id);
        if (!id) {
          console.error('Volunteer: Invalid NGO ID - ID is undefined or null');
          setError('Invalid NGO ID');
          setLoading(false);
          return;
        }
        
        // Direct API call
        const response = await axios.get(`http://localhost:5001/api/ngos/${id}`);
        console.log('Volunteer: API Response:', response.data);
        
        if (response.data && response.data.success && response.data.data) {
          setNGO(response.data.data);
        } else {
          setError('Failed to load NGO data');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Volunteer: Error fetching NGO:', err);
        setError('Failed to load NGO data. Please try again.');
        setLoading(false);
      }
    };

    fetchNGO();
  }, [id]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Create volunteer data object with proper error checking
      const volunteerData = {
        ...formData,
        ngo: id,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        interests: formData.interests.split(',').map(interest => interest.trim())
      };
      
      // Only add user ID if it exists in the user object
      if (user && user.id) {
        volunteerData.user = user.id;
      } else if (user && user._id) {
        volunteerData.user = user._id;
      }
      
      console.log('Volunteer data:', volunteerData);
      
      await axios.post(
        'http://localhost:5001/api/volunteers',
        volunteerData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Show success message before navigating
      setSuccess(true);
      
      // Navigate after showing success message
      setTimeout(() => {
        navigate(`/ngo/${id}`, {
          state: {
            message: 'Thank you for volunteering! Your application has been submitted.',
            type: 'success'
          }
        });
      }, 3000);
    } catch (err) {
      console.error('Volunteer error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to process volunteer application. Please try again.';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Volunteer Information</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            {' '}
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          NGO not found
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="container mt-5">
        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              <i className="fas fa-check-circle me-2"></i>
              Volunteer Application Submitted!
            </h4>
          </div>
          <div className="card-body text-center">
            <div className="display-1 text-success mb-3">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h5>Thank you for volunteering with {ngo.name}!</h5>
            <p className="text-muted">
              Your application has been submitted successfully. The NGO will review your application and contact you soon.
            </p>
            <div className="progress mb-3">
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                role="progressbar" 
                style={{ width: '100%' }}
              ></div>
            </div>
            <p>Redirecting you back to the NGO page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card volunteer-card">
            <div className="volunteer-header">
              <h2 className="text-center mb-0 volunteer-title">
                Volunteer for {ngo.name}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '25%',
                  width: '50%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
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
                  {error}
                </div>
              )}
              
              <div className="text-center mb-4" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                <p className="lead" style={{ color: '#008080' }}>
                  Join {ngo.name}'s volunteer team in {ngo.location} and make a difference!
                </p>
              </div>
              
              <form onSubmit={onSubmit} style={{ position: 'relative', zIndex: 2 }}>
                <div className="mb-4" style={{ animation: 'fadeInUp 0.7s ease-out' }}>
                  <label htmlFor="skills" className="form-label volunteer-label">
                    <i className="fas fa-tools me-2" style={{ color: '#80f44e' }}></i>
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-control volunteer-input"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={onChange}
                    required
                    placeholder="e.g., Teaching, Cooking, First Aid"
                  />
                  <small className="text-muted" style={{ display: 'block', marginTop: '5px' }}>
                    Share your skills that could help our cause
                  </small>
                </div>
                
                <div className="mb-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                  <label htmlFor="availability" className="form-label volunteer-label">
                    <i className="fas fa-calendar-alt me-2" style={{ color: '#4edbf4' }}></i>
                    Availability
                  </label>
                  <select
                    className="form-select volunteer-input"
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select availability</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                
                <div className="mb-4" style={{ animation: 'fadeInUp 0.9s ease-out' }}>
                  <label htmlFor="interests" className="form-label volunteer-label">
                    <i className="fas fa-heart me-2" style={{ color: '#80f44e' }}></i>
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-control volunteer-input"
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={onChange}
                    required
                    placeholder="e.g., Education, Environment, Health"
                  />
                  <small className="text-muted" style={{ display: 'block', marginTop: '5px' }}>
                    We'll match you with opportunities that align with your interests
                  </small>
                </div>
                
                <div className="mb-4 p-3" style={{ 
                  animation: 'fadeInUp 1s ease-out',
                  background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.1) 0%, rgba(78, 219, 244, 0.1) 100%)',
                  borderRadius: '10px',
                  border: '1px solid rgba(78, 219, 244, 0.2)'
                }}>
                  <h5 style={{ 
                    color: '#008080',
                    borderBottom: '2px solid rgba(128, 244, 78, 0.3)',
                    paddingBottom: '8px',
                    marginBottom: '15px'
                  }}>
                    <i className="fas fa-info-circle me-2" style={{ color: '#4edbf4' }}></i>
                    Volunteer Information
                  </h5>
                  
                  <p className="mb-2">
                    <i className="fas fa-map-marker-alt me-2" style={{ color: '#80f44e' }}></i>
                    <strong>Location:</strong> {ngo.location}
                  </p>
                  
                  <p className="mb-2">
                    <i className="fas fa-tag me-2" style={{ color: '#4edbf4' }}></i>
                    <strong>Category:</strong> {ngo.category}
                  </p>
                  
                  <p className="mb-0">
                    <i className="fas fa-users me-2" style={{ color: '#80f44e' }}></i>
                    <strong>Current Volunteers:</strong> {ngo.volunteerCount || 'Many volunteers'} already helping
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-100 volunteer-button"
                  style={{ animation: 'fadeInUp 1.1s ease-out' }}
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
                  <i className="fas fa-hands-helping me-2"></i>
                  Submit Application
                </button>
                
                <div className="text-center mt-3" style={{ animation: 'fadeInUp 1.2s ease-out' }}>
                  <small className="text-muted">
                    Thank you for your interest in volunteering with {ngo.name}!
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer; 