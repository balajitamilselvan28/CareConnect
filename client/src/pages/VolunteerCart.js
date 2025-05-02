import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Add custom animations for the My NGOs page
const myNGOsAnimations = `
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
      box-shadow: 0 5px 15px rgba(0, 128, 128, 0.1);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 10px 25px rgba(0, 128, 128, 0.2);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 5px 15px rgba(0, 128, 128, 0.1);
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
  
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  .ngo-card {
    animation: fadeInUp 0.8s ease-out;
    transition: all 0.3s ease;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .ngo-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 128, 128, 0.2);
  }
  
  .ngo-header {
    background: linear-gradient(135deg, rgba(128, 244, 78, 0.2) 0%, rgba(78, 219, 244, 0.2) 100%);
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
    padding: 20px;
    border-bottom: 1px solid rgba(128, 244, 78, 0.2);
  }
  
  .ngo-title {
    color: #008080;
    font-weight: 600;
  }
  
  .ngo-button {
    background: linear-gradient(135deg, #008080 0%, #0066CC 100%);
    border: none;
    color: white;
    padding: 8px 20px;
    border-radius: 25px;
    box-shadow: 0 4px 15px rgba(0, 102, 204, 0.2);
    transition: all 0.3s ease;
  }
  
  .ngo-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 128, 128, 0.3);
  }
  
  .page-title {
    background: linear-gradient(90deg, #008080, #0066CC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    position: relative;
  }
  
  .empty-state {
    animation: float 6s ease-in-out infinite;
  }
`;

// Add the animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(myNGOsAnimations));
document.head.appendChild(style);

const VolunteerCart = () => {
  const { user } = useAuth();
  const [volunteerActivities, setVolunteerActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteerActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/volunteers/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setVolunteerActivities(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching volunteer activities:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load volunteer activities';
        console.error('Error message:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchVolunteerActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" role="status" style={{ color: '#008080', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: '#008080', fontWeight: '500' }}>Loading your volunteer activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px', animation: 'fadeInUp 0.5s ease-out' }}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="btn ngo-button">
            <i className="fas fa-home me-2"></i>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h2 className="page-title mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            My Volunteer Activities
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '25%',
              width: '50%',
              height: '3px',
              background: 'linear-gradient(90deg, #008080, #0066CC)',
              borderRadius: '2px',
              animation: 'gradientShift 3s ease infinite'
            }}></div>
          </h2>
          <p className="text-muted" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            Track your volunteer activities and contributions to various NGOs
          </p>
        </div>
      </div>
      
      {volunteerActivities.length === 0 ? (
        <div className="row justify-content-center" style={{ minHeight: '40vh' }}>
          <div className="col-md-8 text-center empty-state">
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.1) 0%, rgba(78, 219, 244, 0.1) 100%)',
              padding: '40px',
              borderRadius: '20px',
              marginBottom: '30px'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Volunteer" 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '5px solid white',
                  boxShadow: '0 10px 30px rgba(0, 128, 128, 0.2)',
                  marginBottom: '20px'
                }}
              />
              <h3 style={{ color: '#008080', marginBottom: '15px' }}>
                <i className="fas fa-hands-helping me-2"></i>
                Start Your Volunteering Journey
              </h3>
              <p className="mb-4">
                You haven't volunteered for any NGOs yet. Explore our NGO listings and find causes you're passionate about!
              </p>
              <Link to="/" className="btn ngo-button btn-lg">
                <i className="fas fa-search me-2"></i>
                Browse NGOs
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {volunteerActivities.map((activity, index) => (
            <div key={activity._id} className="col-md-6 mb-4" style={{ animationDelay: `${0.1 * index}s` }}>
              <div className="card ngo-card">
                <div className="ngo-header">
                  <h5 className="ngo-title mb-0">
                    <i className="fas fa-building me-2"></i>
                    {activity.ngo.name}
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className={`badge ${
                        activity.status === 'approved'
                          ? 'bg-success'
                          : activity.status === 'pending'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                      style={{ 
                        padding: '8px 15px', 
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className={`fas ${
                        activity.status === 'approved'
                          ? 'fa-check-circle'
                          : activity.status === 'pending'
                          ? 'fa-clock'
                          : 'fa-times-circle'
                      } me-1`}></i>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {activity.ngo.location || 'Location not specified'}
                    </small>
                  </div>
                  
                  <div className="mb-3 p-3" style={{ 
                    background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.1) 0%, rgba(78, 219, 244, 0.1) 100%)',
                    borderRadius: '10px'
                  }}>
                    <h6 style={{ color: '#008080' }}>
                      <i className="fas fa-tools me-2"></i>
                      Skills
                    </h6>
                    <div>
                      {activity.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="badge me-2 mb-2"
                          style={{ 
                            background: 'linear-gradient(135deg, #80f44e 0%, #4edbf4 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            boxShadow: '0 2px 5px rgba(0, 128, 128, 0.2)'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 style={{ color: '#008080' }}>
                      <i className="fas fa-calendar-alt me-2"></i>
                      Availability
                    </h6>
                    <p className="mb-0" style={{ 
                      padding: '6px 12px',
                      background: 'rgba(0, 128, 128, 0.1)',
                      borderRadius: '20px',
                      display: 'inline-block'
                    }}>
                      {activity.availability}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 style={{ color: '#008080' }}>
                      <i className="fas fa-heart me-2"></i>
                      Interests
                    </h6>
                    <div>
                      {activity.interests.map((interest, index) => (
                        <span 
                          key={index} 
                          className="badge me-2 mb-2"
                          style={{ 
                            background: 'linear-gradient(135deg, #0066CC 0%, #008080 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            boxShadow: '0 2px 5px rgba(0, 102, 204, 0.2)'
                          }}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between">
                    <Link
                      to={`/ngo/${activity.ngo._id}`}
                      className="btn ngo-button"
                    >
                      <i className="fas fa-eye me-2"></i>
                      View NGO
                    </Link>
                    
                    {activity.status === 'approved' && (
                      <Link
                        to={`/volunteer-certificate/${activity._id}`}
                        className="btn btn-outline-success"
                        style={{ 
                          borderRadius: '25px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-certificate me-2"></i>
                        Certificate
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerCart; 