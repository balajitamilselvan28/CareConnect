import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Volunteer for {ngo.name}</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="skills" className="form-label">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={onChange}
                    required
                    placeholder="e.g., Teaching, Cooking, First Aid"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="availability" className="form-label">
                    Availability
                  </label>
                  <select
                    className="form-select"
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
                <div className="mb-3">
                  <label htmlFor="interests" className="form-label">
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={onChange}
                    required
                    placeholder="e.g., Education, Environment, Health"
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer; 