import React, { useState, useEffect } from 'react';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getSafeImageUrl, handleImageError } from '../utils/imageUtils';

const AdminDashboard = () => {
  const { ngos, loading: ngoLoading, error: ngoError } = useNGO();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ngos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [donationsRes, volunteersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/donations', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:5000/api/volunteers', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        setDonations(donationsRes.data.data);
        setVolunteers(volunteersRes.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || ngoLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || ngoError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || ngoError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'ngos' ? 'active' : ''}`}
            onClick={() => setActiveTab('ngos')}
          >
            NGOs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            Volunteers
          </button>
        </li>
      </ul>

      {activeTab === 'ngos' && (
        <div className="row">
          {ngos.map((ngo) => (
            <div key={ngo._id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={getSafeImageUrl(ngo.photo)}
                  className="card-img-top"
                  alt={ngo.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={handleImageError}
                />
                <div className="card-body">
                  <h5 className="card-title">{ngo.name}</h5>
                  <p className="card-text">{ngo.slogan}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      {ngo.volunteerCount} Volunteers
                    </small>
                  </p>
                  <button className="btn btn-primary me-2">Edit</button>
                  <button className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>NGO</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.ngo.name}</td>
                  <td>{donation.name}</td>
                  <td>${donation.amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        donation.status === 'completed'
                          ? 'bg-success'
                          : donation.status === 'pending'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td>
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'volunteers' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>NGO</th>
                <th>Volunteer</th>
                <th>Status</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id}>
                  <td>{volunteer.ngo.name}</td>
                  <td>{volunteer.user.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        volunteer.status === 'approved'
                          ? 'bg-success'
                          : volunteer.status === 'pending'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                    >
                      {volunteer.status}
                    </span>
                  </td>
                  <td>
                    {volunteer.skills.map((skill, index) => (
                      <span key={index} className="badge bg-info me-1">
                        {skill}
                      </span>
                    ))}
                  </td>
                  <td>{volunteer.availability}</td>
                  <td>
                    <button className="btn btn-sm btn-success me-2">
                      Approve
                    </button>
                    <button className="btn btn-sm btn-danger">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 