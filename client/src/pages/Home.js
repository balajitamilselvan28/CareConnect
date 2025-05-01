import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getSafeImageUrl, handleImageError, preloadImage } from '../utils/imageUtils';
import ngoLogo from '../ngo center logo.jpg';

// Sample NGO data with nature-themed images
const sampleNGOs = [
  {
    _id: '1',
    name: 'Green Earth Initiative',
    slogan: 'Protecting Our Planet Together',
    location: 'New York, USA',
    photo: 'https://i.imgur.com/0Z6BqA4.jpg',
    volunteerCount: 120,
    category: 'Environment',
    description: 'Dedicated to preserving our planet through sustainable practices and community engagement.'
  },
  {
    _id: '2',
    name: 'Wildlife Conservation',
    slogan: 'Saving Wildlife, Saving Earth',
    location: 'San Francisco, USA',
    photo: 'https://images.unsplash.com/photo-1534567110353-1f46d070c2c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 85,
    category: 'Wildlife',
    description: 'Working to protect endangered species and their natural habitats.'
  },
  {
    _id: '3',
    name: 'Ocean Guardians',
    slogan: 'Protecting Marine Life',
    location: 'Miami, USA',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 65,
    category: 'Marine',
    description: 'Dedicated to ocean conservation and marine life protection.'
  },
  {
    _id: '4',
    name: 'Forest Friends',
    slogan: 'Preserving Our Forests',
    location: 'Portland, USA',
    photo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 95,
    category: 'Forest',
    description: 'Working to protect and restore forest ecosystems.'
  },
  {
    _id: '5',
    name: 'Clean Energy Future',
    slogan: 'Powering Tomorrow Sustainably',
    location: 'Seattle, USA',
    photo: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 75,
    category: 'Energy',
    description: 'Promoting renewable energy and sustainable practices.'
  }
];

// Custom styles with Care Connect logo colors (blue and green)
const styles = {
  hero: {
    background: 'linear-gradient(135deg, rgba(0, 128, 128, 0.15) 0%, rgba(0, 102, 204, 0.15) 100%)',
    padding: '80px 0',
    position: 'relative',
    overflow: 'hidden'
  },
  card: {
    border: '1px solid rgba(0, 128, 128, 0.1)',
    borderRadius: '15px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0, 128, 128, 0.15)'
    }
  },
  searchBar: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '25px',
    padding: '10px 20px',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.1)'
  },
  categoryPill: {
    background: 'rgba(0, 128, 128, 0.1)',
    color: '#008080',
    padding: '5px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(0, 102, 204, 0.2)'
    }
  }
};

const Home = () => {
  const { ngos: contextNgos, loading: contextLoading, error: contextError } = useNGO();
  const { user } = useAuth();
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [myNGOs, setMyNGOs] = useState([]);
  const [loadingMyNGOs, setLoadingMyNGOs] = useState(false);

  useEffect(() => {
    if (contextNgos && contextNgos.length > 0) {
      setNgos(contextNgos);
      setLoading(false);
    } else {
      // Use sample data if context fails
      setNgos(sampleNGOs);
      setLoading(false);
    }
  }, [contextNgos]);
  
  // Fetch user's volunteered NGOs
  useEffect(() => {
    const fetchMyNGOs = async () => {
      if (!user) return;
      
      setLoadingMyNGOs(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/volunteers/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.data && res.data.data) {
          // Extract NGO data from volunteer activities
          const ngoData = res.data.data.map(activity => activity.ngo);
          setMyNGOs(ngoData);
        }
      } catch (err) {
        console.error('Error fetching volunteered NGOs:', err);
      } finally {
        setLoadingMyNGOs(false);
      }
    };
    
    fetchMyNGOs();
  }, [user]);

  // Filter NGOs based on search and category
  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(search.toLowerCase()) ||
                         ngo.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || ngo.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Environment', 'Wildlife', 'Marine', 'Forest', 'Energy'];

  // Preload NGO images when they change
  useEffect(() => {
    if (ngos && ngos.length > 0) {
      ngos.forEach(ngo => {
        if (ngo.photo) {
          preloadImage(ngo.photo);
        }
      });
    }
  }, [ngos]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-success">Loading NGOs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mt-4">
        <img 
          src={ngoLogo} 
          alt="CareConnect Logo" 
          style={{ maxWidth: '220px', width: '100%', height: 'auto', marginBottom: '20px' }} 
        />
      </div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-8">
              <h1 className="display-4 mb-4" style={{ color: '#008080' }}>Make a Difference Today</h1>
              <p className="lead mb-5" style={{ color: '#0066CC' }}>
                Join hands with NGOs working towards a better tomorrow. Your contribution matters.
              </p>
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="input-group mb-3" style={styles.searchBar}>
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Search NGOs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn" style={{ backgroundColor: '#0066CC', color: 'white' }}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My NGOs Section - Only show if user is logged in and has volunteered */}
      {user && myNGOs.length > 0 && (
        <div className="container mt-5">
          <h3 className="mb-4" style={{ color: '#008080' }}>My Volunteered NGOs</h3>
          <div className="row">
            {myNGOs.map((ngo) => (
              <div key={ngo._id} className="col-md-4 mb-4">
                <div className="card h-100" style={{...styles.card, borderColor: 'rgba(0, 128, 128, 0.5)'}}>
                  <div className="card-header bg-success bg-opacity-10 text-success">
                    <i className="fas fa-hands-helping me-2"></i>
                    You are a volunteer
                  </div>
                  <img
                    src={getSafeImageUrl(ngo.photo)}
                    className="card-img-top"
                    alt={ngo.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: '#008080' }}>{ngo.name}</h5>
                    <p className="card-text text-muted">{ngo.slogan}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {ngo.location}
                      </small>
                    </p>
                    <Link 
                      to={`/ngo/${ngo._id}`} 
                      className="btn w-100"
                      style={{ backgroundColor: '#008080', color: 'white' }}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="container mt-5">
        <div className="d-flex justify-content-center gap-3 mb-5">
          {categories.map((cat) => (
            <span
              key={cat}
              style={{
                ...styles.categoryPill,
                backgroundColor: category === cat ? 'rgba(34, 139, 34, 0.2)' : 'rgba(34, 139, 34, 0.1)',
                fontWeight: category === cat ? 'bold' : 'normal'
              }}
              onClick={() => setCategory(cat === category ? '' : cat)}
              className={category === cat ? 'active' : ''}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* NGO Cards */}
        <div className="row">
          {filteredNGOs.map((ngo) => (
            <div key={ngo._id} className="col-md-4 mb-4">
              <div className="card h-100" style={styles.card}>
                <img
                  src={getSafeImageUrl(ngo.photo)}
                  className="card-img-top"
                  alt={ngo.name}
                  style={{ height: '250px', objectFit: 'cover' }}
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#008080' }}>{ngo.name}</h5>
                  <p className="card-text text-muted">{ngo.slogan}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {ngo.location}
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      <i className="fas fa-users me-2"></i>
                      {ngo.volunteerCount} Volunteers
                    </small>
                  </p>
                  <Link 
                    to={`/ngo/${ngo._id}`} 
                    className="btn w-100"
                    style={{ backgroundColor: '#0066CC', color: 'white' }}
                  >
                    <i className="fas fa-hands-helping me-2"></i>
                    Get Involved
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredNGOs.length === 0 && (
          <div className="text-center mt-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No NGOs found</h4>
            <p className="text-muted">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 