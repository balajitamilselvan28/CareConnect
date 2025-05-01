import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Volunteer Activities</h2>
      {volunteerActivities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You haven't volunteered for any NGOs yet.{' '}
          <Link to="/" className="alert-link">
            Browse NGOs
          </Link>
        </div>
      ) : (
        <div className="row">
          {volunteerActivities.map((activity) => (
            <div key={activity._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{activity.ngo.name}</h5>
                  <p className="card-text">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`badge ${
                        activity.status === 'approved'
                          ? 'bg-success'
                          : activity.status === 'pending'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </p>
                  <p className="card-text">
                    <strong>Skills:</strong>{' '}
                    {activity.skills.map((skill, index) => (
                      <span key={index} className="badge bg-info me-1">
                        {skill}
                      </span>
                    ))}
                  </p>
                  <p className="card-text">
                    <strong>Availability:</strong> {activity.availability}
                  </p>
                  <p className="card-text">
                    <strong>Interests:</strong>{' '}
                    {activity.interests.map((interest, index) => (
                      <span key={index} className="badge bg-secondary me-1">
                        {interest}
                      </span>
                    ))}
                  </p>
                  <Link
                    to={`/ngo/${activity.ngo._id}`}
                    className="btn btn-primary"
                  >
                    View NGO
                  </Link>
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