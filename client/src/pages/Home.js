import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getSafeImageUrl, handleImageError, preloadImage } from '../utils/imageUtils';
import ngoLogo from './ccngo.png';

// Add custom font styles
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap');
`;

// Add animations for UI effects
const animations = `
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
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
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
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
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
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
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

// Add the font styles and animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(fontStyles + animations));
document.head.appendChild(style);

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

// Modern styles with enhanced visual effects
const styles = {
  hero: {
    background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.3) 0%, rgba(78, 219, 244, 0.3) 100%)',
    padding: '120px 0 100px',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(128, 244, 78, 0.1)',
    boxShadow: '0 10px 30px rgba(78, 219, 244, 0.08)',
    marginTop: '-20px'
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  },
  card: {
    border: 'none',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08), 0 6px 6px rgba(0, 0, 0, 0.05)',
    transform: 'translateY(0)',
    backgroundColor: 'white',
    position: 'relative'
  },
  cardHover: {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.12), 0 10px 10px rgba(0, 0, 0, 0.08)'
  },
  cardRibbon: {
    position: 'absolute',
    top: 20,
    right: -30,
    transform: 'rotate(45deg)',
    width: 150,
    backgroundColor: 'rgba(128, 244, 78, 0.9)',
    color: 'white',
    textAlign: 'center',
    lineHeight: '30px',
    letterSpacing: 1,
    fontWeight: 'bold',
    fontSize: '0.8rem',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 10
  },
  cardImage: {
    height: '250px',
    width: '100%',
    objectFit: 'cover',
    transition: 'all 0.5s ease',
    transform: 'scale(1)'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '250px',
    overflow: 'hidden'
  },
  cardImageHover: {
    transform: 'scale(1.05)'
  },
  cardBody: {
    padding: '1.5rem',
    position: 'relative'
  },
  cardCategory: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(128, 244, 78, 0.9)',
    color: 'white',
    padding: '6px 15px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(78, 219, 244, 0.2)',
    zIndex: 10
  },
  searchBar: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '30px',
    padding: '8px 8px 8px 25px',
    boxShadow: '0 10px 25px rgba(78, 219, 244, 0.1)',
    border: '1px solid rgba(128, 244, 78, 0.1)',
    transition: 'all 0.3s ease'
  },
  searchBarFocus: {
    boxShadow: '0 15px 30px rgba(78, 219, 244, 0.15)',
    transform: 'translateY(-2px)'
  },
  searchButton: {
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #80f44e 0%, #4edbf4 100%)',
    border: 'none',
    boxShadow: '0 4px 10px rgba(78, 219, 244, 0.3)',
    transition: 'all 0.3s ease'
  },
  searchButtonHover: {
    transform: 'rotate(5deg) scale(1.05)',
    boxShadow: '0 6px 15px rgba(128, 244, 78, 0.4)'
  },
  categoryPill: {
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#80f44e',
    padding: '8px 18px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '0 5px',
    boxShadow: '0 4px 10px rgba(78, 219, 244, 0.05)',
    border: '1px solid rgba(128, 244, 78, 0.1)',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'inline-block'
  },
  categoryPillActive: {
    background: 'linear-gradient(135deg, #80f44e 0%, #4edbf4 100%)',
    color: 'white',
    boxShadow: '0 6px 15px rgba(78, 219, 244, 0.2)'
  },
  categoryPillHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
  },
  sectionTitle: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '2rem',
    color: '#80f44e',
    fontWeight: '700'
  },
  sectionTitleUnderline: {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '0',
    width: '50px',
    height: '4px',
    background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
    borderRadius: '2px'
  },
  button: {
    borderRadius: '30px',
    padding: '10px 25px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #80f44e 0%, #4edbf4 100%)',
    border: 'none',
    color: 'white',
    boxShadow: '0 6px 15px rgba(78, 219, 244, 0.2)'
  },
  buttonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(128, 244, 78, 0.3)'
  },
  volunteerBadge: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    backgroundColor: 'rgba(128, 244, 78, 0.9)',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    zIndex: 1,
    boxShadow: '0 4px 8px rgba(78, 219, 244, 0.15)'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    marginTop: '10px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: '#666'
  }
};

// Helper function to get appropriate icon for each category
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Environment':
      return 'leaf';
    case 'Wildlife':
      return 'paw';
    case 'Marine':
      return 'water';
    case 'Forest':
      return 'tree';
    case 'Energy':
      return 'bolt';
    case 'Education':
      return 'book';
    case 'Community Development':
      return 'users';
    default:
      return 'globe';
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
  
  // State for hover effects
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchButtonHovered, setSearchButtonHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

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
    <div className="home-page">
      {/* Premium Header with Enhanced Logo */}
      <div className="header-container py-3" style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(240,255,245,0.97) 100%)',
        boxShadow: '0 8px 25px rgba(78, 219, 244, 0.08)',
        position: 'relative',
        zIndex: 100,
        borderBottom: '1px solid rgba(128, 244, 78, 0.1)'
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div style={{
                position: 'relative',
                width: '130px',
                height: '130px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0, 128, 128, 0.1) 0%, rgba(0, 102, 204, 0.1) 100%)',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 0 20px rgba(0, 128, 128, 0.2)'
                }}></div>
                <img 
                  src={ngoLogo} 
                  alt="CareConnect Logo" 
                  style={{ 
                    width: '90px', 
                    height: 'auto', 
                    filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.15))',
                    animation: 'fadeInDown 0.8s ease-out',
                    position: 'relative',
                    zIndex: 2
                  }} 
                />
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.2rem',
                  letterSpacing: '-0.5px',
                  position: 'relative'
                }}>
                  CareConnect
                  <span style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '40%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #80f44e, transparent)',
                    borderRadius: '2px'
                  }}></span>
                </h2>
                <p style={{
                  margin: '5px 0 0',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.95rem',
                  color: '#333',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>CONNECTING HEARTS, CHANGING LIVES</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.9rem',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '600'
              }}>
                <i className="fas fa-globe me-2" style={{ color: '#80f44e' }}></i>
                <span style={{
                  background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Connecting Communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS animation for the logo pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.3;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.7;
            }
          }
        `}
      </style>

      {/* Hero Section with Pattern Background */}
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '30px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '-30px',
                  width: '60px',
                  height: '60px',
                  background: 'rgba(128, 244, 78, 0.1)',
                  borderRadius: '50%',
                  zIndex: -1
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '-20px',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(78, 219, 244, 0.1)',
                  borderRadius: '50%',
                  zIndex: -1
                }}></div>
                <h1 
                  className="mb-4" 
                  style={{ 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: '4rem',
                    background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(78, 219, 244, 0.1)',
                    animation: 'fadeInUp 0.8s ease-out',
                    letterSpacing: '-1px',
                    lineHeight: '1.2'
                  }}
                >
                  Make a <span style={{position: 'relative', display: 'inline-block'}}>Difference
                    <span style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '0',
                      width: '100%',
                      height: '10px',
                      background: 'rgba(0, 128, 128, 0.2)',
                      borderRadius: '4px',
                      zIndex: -1
                    }}></span>
                  </span> Today
                </h1>
              </div>
              <p 
                className="mb-5" 
                style={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  color: '#444', 
                  fontSize: '1.4rem',
                  animation: 'fadeInUp 1s ease-out',
                  lineHeight: 1.7,
                  fontWeight: 400,
                  maxWidth: '700px',
                  margin: '0 auto 30px'
                }}
              >
                Join hands with NGOs working towards a <strong style={{
                  color: '#4edbf4',
                  fontWeight: 600,
                  borderBottom: '2px solid rgba(78, 219, 244, 0.3)'
                }}>better tomorrow</strong>. 
                <br />Your contribution can <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontStyle: 'italic', 
                  color: '#80f44e',
                  fontWeight: 600,
                  position: 'relative'
                }}>change lives
                  <svg style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    width: '100%',
                    height: '8px',
                    zIndex: -1
                  }} viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,0 Q50,10 100,0" stroke="#80f44e" strokeWidth="2" fill="none" />
                  </svg>
                </span>.
              </p>
              <div className="row justify-content-center">
                <div className="col-md-10">
                  <div 
                    className="input-group mb-3" 
                    style={{
                      ...styles.searchBar,
                      ...(searchFocused ? styles.searchBarFocus : {})
                    }}
                  >
                    <span className="input-group-text bg-transparent border-0 text-muted">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none bg-transparent"
                      placeholder="Search NGOs by name, location, or description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      style={{ fontSize: '1.05rem' }}
                    />
                    <button 
                      className="btn" 
                      style={{
                        ...styles.searchButton,
                        ...(searchButtonHovered ? styles.searchButtonHover : {})
                      }}
                      onMouseEnter={() => setSearchButtonHovered(true)}
                      onMouseLeave={() => setSearchButtonHovered(false)}
                    >
                      <i className="fas fa-arrow-right text-white"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Categories Section with Modern Pills */}
      <div className="container mt-5 mb-5">
        <div className="text-center mb-4">
          <h3 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: '1.8rem',
            color: '#008080',
            marginBottom: '15px',
            position: 'relative',
            display: 'inline-block'
          }}>
            Browse by Category
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '25%',
              width: '50%',
              height: '3px',
              background: 'linear-gradient(90deg, #008080, #0066CC)',
              borderRadius: '2px'
            }}></div>
          </h3>
          <p className="text-muted mb-4" style={{
            maxWidth: '500px',
            margin: '15px auto 25px',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            Filter organizations by their focus area to find the perfect match for your interests
          </p>
        </div>
        <div className="d-flex justify-content-center flex-wrap gap-3 mb-5 px-2" style={{
          background: 'rgba(240, 248, 255, 0.5)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)'
        }}>
          <span
            style={{
              ...styles.categoryPill,
              ...(category === '' ? styles.categoryPillActive : {}),
              ...(hoveredCategory === 'all' ? styles.categoryPillHover : {}),
              margin: '0.5rem 0.3rem',
              padding: '10px 22px',
              fontSize: '1rem',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '500'
            }}
            onClick={() => setCategory('')}
            onMouseEnter={() => setHoveredCategory('all')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <i className="fas fa-globe-americas me-2"></i> All
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              style={{
                ...styles.categoryPill,
                ...(category === cat ? styles.categoryPillActive : {}),
                ...(hoveredCategory === cat ? styles.categoryPillHover : {}),
                margin: '0.5rem 0.3rem',
                padding: '10px 22px',
                fontSize: '1rem',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '500'
              }}
              onClick={() => setCategory(cat === category ? '' : cat)}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <i className={`fas fa-${getCategoryIcon(cat)} me-2`}></i>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Enhanced My Volunteered NGOs Section */}
      {user && myNGOs.length > 0 && (
        <div className="container mt-5 mb-5">
          <div className="mb-4 text-center">
            <div style={{
              display: 'inline-block',
              position: 'relative',
              padding: '0 15px'
            }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '2.2rem',
                color: '#008080',
                marginBottom: '10px',
                position: 'relative',
                display: 'inline-block'
              }}>
                My Volunteered NGOs
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '0',
                  width: '60%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #008080, #0066CC)',
                  borderRadius: '2px'
                }}></div>
              </h3>
            </div>
            <p className="text-muted mb-4" style={{
              maxWidth: '600px',
              margin: '15px auto 30px',
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Organizations where you're making an impact. Track your volunteer activities and stay connected.
            </p>
          </div>
          
          <div className="row">
            {myNGOs.map((ngo) => (
              <div key={ngo._id} className="col-md-4 mb-4">
                <div 
                  className="card h-100 position-relative" 
                  style={{
                    ...styles.card,
                    ...(hoveredCard === `my-${ngo._id}` ? styles.cardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(`my-${ngo._id}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{
                    ...styles.volunteerBadge,
                    background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
                    padding: '6px 15px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    zIndex: 10
                  }}>
                    <i className="fas fa-hands-helping me-2"></i>
                    Active Volunteer
                  </div>
                  <div style={styles.imageContainer}>
                    <img
                      src={getSafeImageUrl(ngo.photo)}
                      className="card-img-top"
                      alt={ngo.name}
                      style={{
                        ...styles.cardImage,
                        ...(hoveredCard === `my-${ngo._id}` ? styles.cardImageHover : {})
                      }}
                      onError={handleImageError}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                      height: '50%',
                      pointerEvents: 'none'
                    }}></div>
                  </div>
                  <div style={{
                    ...styles.cardBody,
                    padding: '1.8rem'
                  }}>
                    <h5 className="card-title mb-2" style={{ 
                      color: '#008080', 
                      fontWeight: '700',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '1.25rem'
                    }}>{ngo.name}</h5>
                    <p className="card-text text-muted mb-2" style={{ 
                      fontSize: '0.95rem',
                      fontStyle: 'italic'
                    }}>{ngo.slogan}</p>
                    
                    {/* Description with truncation */}
                    <p className="card-text mb-3" style={{ 
                      fontSize: '0.95rem', 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.6',
                      color: '#444'
                    }}>
                      {ngo.description}
                    </p>
                    
                    <div style={{
                      ...styles.statsContainer,
                      borderTop: '1px solid rgba(0, 128, 128, 0.1)',
                      padding: '12px 0'
                    }}>
                      <div style={{
                        ...styles.statItem,
                        fontSize: '0.9rem',
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: '500',
                        color: '#444'
                      }}>
                        <i className="fas fa-map-marker-alt me-2" style={{ color: '#0066CC' }}></i>
                        {ngo.location || 'Global'}
                      </div>
                      <div style={{
                        ...styles.statItem,
                        fontSize: '0.9rem',
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: '500',
                        color: '#008080'
                      }}>
                        <i className="fas fa-calendar-check me-2" style={{ color: '#008080' }}></i>
                        Active
                      </div>
                    </div>
                    
                    <div className="mt-3 d-flex gap-2">
                      <Link 
                        to={`/ngo/${ngo._id}`} 
                        className="btn flex-grow-1"
                        style={{
                          ...styles.button,
                          ...(hoveredCard === `my-${ngo._id}` ? styles.buttonHover : {})
                        }}
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        View Details
                      </Link>
                      <button 
                        className="btn"
                        style={{
                          borderRadius: '50%',
                          width: '45px',
                          height: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'white',
                          border: '1px solid rgba(0, 128, 128, 0.3)',
                          color: '#008080',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-share-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced All NGOs Section */}
      <div className="container mt-5 mb-5">
        <div className="mb-4 text-center">
          <div style={{
            display: 'inline-block',
            position: 'relative',
            padding: '0 15px'
          }}>
            <h3 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: '2.2rem',
              color: '#008080',
              marginBottom: '10px',
              position: 'relative',
              display: 'inline-block'
            }}>
              {category ? `${category} NGOs` : 'All NGOs'}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '0',
                width: '60%',
                height: '4px',
                background: 'linear-gradient(90deg, #008080, #0066CC)',
                borderRadius: '2px'
              }}></div>
            </h3>
          </div>
          <p className="text-muted mb-4" style={{
            maxWidth: '700px',
            margin: '15px auto 30px',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Discover organizations making a difference in various fields. Find your perfect match to contribute and volunteer.
          </p>
        </div>

        {/* NGO Cards with Modern Design and Animations */}
        <div className="row">
          {filteredNGOs.map((ngo, index) => (
            <div key={ngo._id} className="col-lg-4 col-md-6 mb-4" style={{
              animation: `fadeInUp 0.6s ease-out ${0.1 * index}s`,
              animationFillMode: 'both'
            }}>
              <div 
                className="card h-100 position-relative" 
                style={{
                  ...styles.card,
                  ...(hoveredCard === ngo._id ? styles.cardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(ngo._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Featured Ribbon - only show for first NGO in each category */}
                {filteredNGOs.findIndex(n => n.category === ngo.category) === filteredNGOs.indexOf(ngo) && (
                  <div style={styles.cardRibbon}>FEATURED</div>
                )}
                
                <div style={styles.imageContainer}>
                  <img
                    src={getSafeImageUrl(ngo.photo)}
                    className="card-img-top"
                    alt={ngo.name}
                    style={{
                      ...styles.cardImage,
                      ...(hoveredCard === ngo._id ? styles.cardImageHover : {})
                    }}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div style={styles.cardCategory}>
                    <i className={`fas fa-${getCategoryIcon(ngo.category)} me-1`}></i>
                    {ngo.category}
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <h5 className="card-title mb-2" style={{ 
                    fontWeight: '700',
                    background: 'linear-gradient(90deg, #008080, #0066CC)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}>
                    {ngo.name}
                  </h5>
                  <p className="card-text mb-2" style={{ 
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    color: '#666',
                    borderLeft: '3px solid rgba(128, 244, 78, 0.7)',
                    paddingLeft: '10px',
                    marginTop: '8px'
                  }}>"{ngo.slogan}"</p>
                  
                  {/* Description with truncation */}
                  <p className="card-text mb-3" style={{ 
                    fontSize: '0.9rem', 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.5'
                  }}>
                    {ngo.description}
                  </p>
                  
                  <div style={styles.statsContainer}>
                    <div style={styles.statItem}>
                      <i className="fas fa-map-marker-alt me-2" style={{ color: '#0066CC' }}></i>
                      {ngo.location}
                    </div>
                    <div style={styles.statItem}>
                      <i className="fas fa-users me-2" style={{ color: '#008080' }}></i>
                      {ngo.volunteerCount} Volunteers
                    </div>
                  </div>
                  
                  {/* Website Link with Enhanced Animations */}
                  {ngo.website && (
                    <div className="mt-3 mb-3">
                      <a 
                        href={ngo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none d-flex align-items-center justify-content-center"
                        style={{
                          color: '#0066CC',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          padding: '10px 15px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1) 0%, rgba(128, 244, 78, 0.1) 100%)',
                          backgroundSize: '200% 200%',
                          border: '1px solid rgba(0, 102, 204, 0.2)',
                          boxShadow: hoveredCard === ngo._id ? '0 5px 15px rgba(0, 102, 204, 0.15)' : 'none',
                          transform: hoveredCard === ngo._id ? 'translateY(-3px)' : 'none',
                          position: 'relative',
                          overflow: 'hidden',
                          animation: hoveredCard === ngo._id ? 'gradientShift 3s ease infinite' : 'none'
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
                          animation: hoveredCard === ngo._id ? 'shine 1.5s infinite' : 'none'
                        }}></div>
                        
                        {/* Ripple effect on hover */}
                        {hoveredCard === ngo._id && (
                          <>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '100%',
                              height: '100%',
                              borderRadius: '10px',
                              border: '1px solid rgba(0, 102, 204, 0.3)',
                              animation: 'ripple 1.5s linear infinite'
                            }}></div>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '100%',
                              height: '100%',
                              borderRadius: '10px',
                              border: '1px solid rgba(0, 102, 204, 0.3)',
                              animation: 'ripple 1.5s linear 0.5s infinite'
                            }}></div>
                          </>
                        )}
                        
                        <i className="fas fa-globe me-2" style={{ 
                          color: '#008080',
                          animation: hoveredCard === ngo._id ? 'pulse 1.5s infinite' : 'none'
                        }}></i>
                        Visit Official Website
                        <i className="fas fa-external-link-alt ms-2" style={{ 
                          fontSize: '0.8rem',
                          animation: hoveredCard === ngo._id ? 'bounce 1s infinite' : 'none'
                        }}></i>
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Link 
                      to={`/ngo/${ngo._id}`} 
                      className="btn w-100"
                      style={{
                        ...styles.button,
                        ...(hoveredCard === ngo._id ? styles.buttonHover : {})
                      }}
                    >
                      <i className="fas fa-hands-helping me-2"></i>
                      Get Involved
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message with Animation */}
        {filteredNGOs.length === 0 && (
          <div className="text-center mt-5 py-5">
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              <i className="fas fa-search fa-3x mb-4" style={{ color: '#0066CC', opacity: 0.7 }}></i>
              <h4 style={{ color: '#008080', fontWeight: '600' }}>No NGOs Found</h4>
              <p className="text-muted mb-4">Try adjusting your search or category filter</p>
              <button 
                className="btn" 
                onClick={() => { setSearch(''); setCategory(''); }}
                style={styles.button}
              >
                <i className="fas fa-redo-alt me-2"></i>
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx="true">{`
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
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .home-page {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home; 