import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getSafeImageUrl, handleImageError } from '../utils/imageUtils';

// Care Connect theme styles with blue and green colors
const styles = {
  header: {
    background: 'linear-gradient(135deg, rgba(0, 128, 128, 0.15) 0%, rgba(0, 102, 204, 0.15) 100%)',
    borderBottom: '1px solid rgba(0, 128, 128, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("/leaf-pattern.png")',
      opacity: 0.1,
      zIndex: 0
    }
  },
  card: {
    border: '1px solid rgba(0, 128, 128, 0.1)',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.1)',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0, 128, 128, 0.15)'
    }
  },
  tabActive: {
    color: '#008080',
    borderBottom: '2px solid #0066CC',
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    borderRadius: '8px 8px 0 0'
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
    border: 'none',
    color: 'white',
    padding: '10px 25px',
    borderRadius: '25px',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 128, 128, 0.3)'
    }
  },
  buttonOutline: {
    color: '#0066CC',
    border: '2px solid rgba(0, 128, 128, 0.5)',
    padding: '10px 25px',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 102, 204, 0.1)',
      transform: 'translateY(-2px)'
    }
  },
  profileImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '4px solid rgba(34, 139, 34, 0.2)',
    boxShadow: '0 4px 15px rgba(34, 139, 34, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(34, 139, 34, 0.3)'
    }
  },
  postImage: {
    maxHeight: '500px',
    objectFit: 'cover',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  eventCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 255, 240, 0.9) 100%)',
    border: '1px solid rgba(34, 139, 34, 0.1)',
    borderRadius: '15px',
    overflow: 'hidden'
  },
  icon: {
    color: '#228B22',
    marginRight: '8px'
  }
};

// Sample posts data
const samplePosts = [
  {
    _id: '1',
    title: 'Tree Planting Day Success',
    content: 'We successfully planted 500 trees in Central Park! Thank you to all our amazing volunteers who made this possible.',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    createdAt: new Date('2024-03-15'),
    likes: 245,
    comments: [
      { _id: '1', text: 'Amazing work!', user: 'John Doe' },
      { _id: '2', text: 'Can\'t wait for the next event!', user: 'Jane Smith' }
    ]
  },
  {
    _id: '2',
    title: 'Wildlife Conservation Update',
    content: 'Our team successfully rescued and rehabilitated 10 endangered species this month. Every life matters!',
    image: 'https://images.unsplash.com/photo-1534567110353-1f46d070c2c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    createdAt: new Date('2024-03-10'),
    likes: 189,
    comments: [
      { _id: '3', text: 'Thank you for your dedication!', user: 'Mike Johnson' }
    ]
  },
  {
    _id: '3',
    title: 'Community Clean-up Drive',
    content: 'Together we collected over 1000 kg of waste from our local beaches. Let\'s keep our oceans clean!',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    createdAt: new Date('2024-03-05'),
    likes: 312,
    comments: [
      { _id: '4', text: 'Great initiative!', user: 'Sarah Wilson' },
      { _id: '5', text: 'Count me in for next time!', user: 'Tom Brown' }
    ]
  }
];

// Sample events data
const sampleEvents = [
  {
    _id: '1',
    title: 'Earth Day Celebration',
    description: 'Join us for a day of environmental awareness, workshops, and community activities.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    date: '2024-04-22',
    time: '10:00 AM - 4:00 PM',
    location: 'Central Park, New York',
    registeredCount: 150
  },
  {
    _id: '2',
    title: 'Wildlife Photography Workshop',
    description: 'Learn wildlife photography techniques from experts and capture the beauty of nature.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    date: '2024-04-15',
    time: '9:00 AM - 2:00 PM',
    location: 'Wildlife Sanctuary, San Francisco',
    registeredCount: 45
  },
  {
    _id: '3',
    title: 'Sustainable Living Seminar',
    description: 'Discover practical ways to reduce your carbon footprint and live more sustainably.',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    date: '2024-04-08',
    time: '2:00 PM - 5:00 PM',
    location: 'Community Center, Seattle',
    registeredCount: 75
  }
];

// Add sample internship data
const sampleInternships = [
  {
    _id: '1',
    title: 'Environmental Research Intern',
    description: 'Join our research team to study local ecosystem changes and contribute to conservation efforts.',
    requirements: ['Environmental Science background', 'Field research experience', 'Data analysis skills'],
    duration: '3 months',
    stipend: '$1000/month',
    location: 'New York Office',
    postedDate: new Date('2024-03-20'),
    deadline: '2024-04-15'
  },
  {
    _id: '2',
    title: 'Social Media & Content Intern',
    description: 'Help us create engaging content and manage our social media presence to spread awareness.',
    requirements: ['Social media management', 'Content creation', 'Basic graphic design'],
    duration: '2 months',
    stipend: '$800/month',
    location: 'Remote',
    postedDate: new Date('2024-03-18'),
    deadline: '2024-04-10'
  }
];

const NGODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [ngo, setNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'events', or 'internships'
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showLikeAnimation, setShowLikeAnimation] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'success'
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch NGO details
        const ngoRes = await axios.get(`http://localhost:5001/api/ngos/${id}`);
        console.log('NGO Response:', ngoRes.data);

        if (!ngoRes.data || !ngoRes.data.success) {
          throw new Error('Failed to load NGO data');
        }

        setNGO(ngoRes.data.data);

        // Use sample data for posts and events
        setPosts(samplePosts);
        setEvents(sampleEvents);

        setLoading(false);
      } catch (err) {
        console.error('Error in fetchNGOData:', err);
        setError(err.response?.data?.error || 'Failed to load NGO data. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchNGOData();
    } else {
      setError('Invalid NGO ID');
      setLoading(false);
    }
  }, [id]);

  const handleDonate = () => {
    if (!user) {
      navigate('/login', { state: { from: `/donation/${id}` } });
      return;
    }
    navigate(`/donation/${id}`);
  };

  const handleVolunteer = () => {
    if (!user) {
      navigate('/login', { state: { from: `/volunteer/${id}` } });
      return;
    }
    navigate(`/volunteer/${id}`);
  };

  const handleLike = (postId) => {
    if (!user) {
      navigate('/login', { state: { from: `/ngo/${id}` } });
      return;
    }

    // Show heart animation
    setShowLikeAnimation(postId);
    setTimeout(() => setShowLikeAnimation(null), 1000);

    // Check if post is already liked
    const isCurrentlyLiked = likedPosts.has(postId);
    console.log(`Post ${postId} is ${isCurrentlyLiked ? 'liked' : 'not liked'}`);
    
    // Find the current post and its like count
    const currentPost = posts.find(post => post._id === postId);
    const currentLikes = currentPost ? currentPost.likes || 0 : 0;
    console.log(`Current likes: ${currentLikes}`);
    
    // Calculate new like count
    const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
    console.log(`New like count will be: ${newLikeCount}`);

    // Update post likes count immediately
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: newLikeCount
          };
        }
        return post;
      })
    );

    // Toggle liked state
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (isCurrentlyLiked) {
        newLikedPosts.delete(postId);
        console.log(`Removed post ${postId} from liked posts`);
      } else {
        newLikedPosts.add(postId);
        console.log(`Added post ${postId} to liked posts`);
      }
      return newLikedPosts;
    });
    
    // In a real app, you would send an API request here to update the like count on the server
    // Example:
    // try {
    //   await axios.post(`http://localhost:5001/api/posts/${postId}/like`, { 
    //     action: isCurrentlyLiked ? 'unlike' : 'like' 
    //   });
    // } catch (error) {
    //   console.error('Error updating like status:', error);
    // }
  };

  // Toggle expanded state for post content
  const toggleExpandPost = (postId) => {
    setExpandedPosts(prev => {
      const newExpandedPosts = new Set(prev);
      if (newExpandedPosts.has(postId)) {
        newExpandedPosts.delete(postId);
      } else {
        newExpandedPosts.add(postId);
      }
      return newExpandedPosts;
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-success">Loading NGO details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading NGO Details</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh Page
            </button>
            <button 
              className="btn btn-outline-primary" 
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home me-2"></i>
              Go to Home
            </button>
          </div>
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

  return (
    <div className="container-fluid p-0">
      {/* CSS for heart animation */}
      <style>
        {`
          @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.3); }
            50% { transform: scale(1); }
            75% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      {/* NGO Header */}
      <div className="py-5" style={styles.header}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-2 text-center">
              <img
                src={getSafeImageUrl(ngo.photo)}
                alt={ngo.name}
                style={styles.profileImage}
                onError={handleImageError}
              />
            </div>
            <div className="col-md-7">
              <h1 className="mb-3 fw-bold" style={{ color: '#008080' }}>{ngo.name}</h1>
              <p className="lead mb-3" style={{ color: '#0066CC' }}>{ngo.slogan}</p>
              <div className="mb-3">
                {/* Location with map marker icon */}
                <p className="mb-2" style={{ color: '#008080' }}>
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {ngo.location}
                </p>
                
                {/* Website link with globe icon */}
                <p className="mb-2" style={{ color: '#0066CC' }}>
                  <i className="fas fa-globe me-2"></i>
                  <a href={ngo.website || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{ color: '#0066CC', textDecoration: 'none' }}
                     className="hover-underline">
                    {ngo.website || "www.careconnect.org"}
                  </a>
                </p>
                
                {/* Email with envelope icon */}
                <p className="mb-2" style={{ color: '#008080' }}>
                  <i className="fas fa-envelope me-2"></i>
                  <a href={`mailto:${ngo.email || "contact@careconnect.org"}`}
                     style={{ color: '#008080', textDecoration: 'none' }}
                     className="hover-underline">
                    {ngo.email || "contact@careconnect.org"}
                  </a>
                </p>
                
                {/* Social Media Links */}
                <div className="mt-3">
                  <a href={ngo.facebook || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="me-3"
                     style={{ color: '#4267B2', fontSize: '1.5rem' }}
                     title="Facebook">
                    <i className="fab fa-facebook-square"></i>
                  </a>
                  <a href={ngo.twitter || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="me-3"
                     style={{ color: '#1DA1F2', fontSize: '1.5rem' }}
                     title="Twitter">
                    <i className="fab fa-twitter-square"></i>
                  </a>
                  <a href={ngo.instagram || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="me-3"
                     style={{ color: '#E1306C', fontSize: '1.5rem' }}
                     title="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href={ngo.linkedin || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{ color: '#0077B5', fontSize: '1.5rem' }}
                     title="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3 text-end">
              <button 
                className="btn me-2" 
                onClick={handleDonate}
                style={{
                  background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
                  color: 'white',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0, 102, 204, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-heart me-2"></i>
                Donate
              </button>
              <button 
                className="btn" 
                onClick={handleVolunteer}
                style={{
                  color: '#0066CC',
                  border: '2px solid rgba(0, 128, 128, 0.5)',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
              >
                <i className="fas fa-hands-helping me-2"></i>
                Volunteer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="row">
          {/* Left Column - Feed */}
          <div className="col-md-8">
            {/* Updated Tab Navigation */}
            <ul className="nav nav-pills mb-4">
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                  style={activeTab === 'posts' ? styles.tabActive : {}}
                >
                  <i className="fas fa-images me-2"></i>
                  Posts
                </button>
              </li>
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                  style={activeTab === 'events' ? styles.tabActive : {}}
                >
                  <i className="fas fa-calendar-alt me-2"></i>
                  Events
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'internships' ? 'active' : ''}`}
                  onClick={() => setActiveTab('internships')}
                  style={activeTab === 'internships' ? styles.tabActive : {}}
                >
                  <i className="fas fa-briefcase me-2"></i>
                  Internships
                </button>
              </li>
            </ul>

            {/* Enhanced Posts Feed with heart animation and read more functionality */}
            {activeTab === 'posts' && (
              <div className="posts-feed">
                {posts.map((post) => (
                  <div key={post._id} className="card mb-4" style={styles.card}>
                    <div className="card-header bg-white d-flex align-items-center">
                      <img
                        src={getSafeImageUrl(ngo.photo)}
                        alt={ngo.name}
                        className="rounded-circle me-3"
                        style={{ width: '45px', height: '45px', objectFit: 'cover', border: '2px solid rgba(0, 128, 128, 0.2)' }}
                      />
                      <div>
                        <h6 className="mb-0" style={{ color: '#008080' }}>{ngo.name}</h6>
                        <small className="text-muted">
                          <i className="far fa-clock me-1"></i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="position-relative">
                      <img
                        src={getSafeImageUrl(post.image)}
                        className="card-img-top"
                        alt={post.title}
                        style={styles.postImage}
                        onDoubleClick={() => handleLike(post._id)}
                      />
                      {/* Large heart animation when double-clicking the image */}
                      {showLikeAnimation === post._id && (
                        <div className="position-absolute top-50 start-50 translate-middle heart-animation">
                          <i className="fas fa-heart" 
                             style={{ 
                               fontSize: '6rem', 
                               color: '#E91E63',
                               opacity: 0.9, 
                               filter: 'drop-shadow(0 0 15px white)',
                               animation: 'heartPulse 1s ease-in-out'
                             }}></i>
                        </div>
                      )}
                      
                      <style jsx="true">{`
                        @keyframes heartPulse {
                          0% { transform: scale(0); opacity: 0; }
                          25% { transform: scale(1.1); opacity: 0.9; }
                          50% { transform: scale(1.2); opacity: 1; }
                          75% { transform: scale(1.1); opacity: 0.9; }
                          100% { transform: scale(1); opacity: 0; }
                        }
                        
                        @keyframes heartBeat {
                          0% { transform: scale(1); }
                          25% { transform: scale(1.4); }
                          50% { transform: scale(1); }
                          75% { transform: scale(1.4); }
                          100% { transform: scale(1); }
                        }
                        
                        .heart-animation {
                          z-index: 10;
                        }
                        
                        .hover-underline {
                          position: relative;
                          transition: all 0.3s ease;
                        }
                        
                        .hover-underline:hover {
                          opacity: 0.8;
                        }
                        
                        .hover-underline::after {
                          content: '';
                          position: absolute;
                          width: 0;
                          height: 1px;
                          bottom: -2px;
                          left: 0;
                          background-color: currentColor;
                          transition: width 0.3s ease;
                        }
                        
                        .hover-underline:hover::after {
                          width: 100%;
                        }
                      `}</style>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        {/* Heart Like Button */}
                        <button 
                          className="btn p-0 me-3"
                          onClick={() => handleLike(post._id)}
                          style={{ 
                            transition: 'all 0.3s ease',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none'
                          }}
                          aria-label="Like post"
                        >
                          <i className={`${likedPosts.has(post._id) ? 'fas' : 'far'} fa-heart`} 
                             style={{ 
                               fontSize: '2.5rem', 
                               color: likedPosts.has(post._id) ? '#E91E63' : '#6c757d',
                               filter: likedPosts.has(post._id) ? 'drop-shadow(0 0 5px rgba(233, 30, 99, 0.5))' : 'none',
                               animation: showLikeAnimation === post._id ? 'heartBeat 1s' : 'none',
                               transform: likedPosts.has(post._id) ? 'scale(1.1)' : 'scale(1)',
                               transition: 'all 0.3s ease'
                             }}></i>
                        </button>
                        
                        {/* Like Count Display */}
                        <span className="me-3" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6c757d' }}>
                          {post.likes || 0}
                        </span>
                        
                        {/* Comment Button */}
                        <button className="btn p-0 me-3" 
                          style={{ background: 'transparent', border: 'none' }}
                          aria-label="Comment">
                          <i className="far fa-comment" 
                             style={{ 
                               fontSize: '2.2rem', 
                               color: '#6c757d' 
                             }}></i>
                        </button>
                        
                        {/* Share Button */}
                        <button className="btn p-0" 
                          style={{ background: 'transparent', border: 'none' }}
                          aria-label="Share">
                          <i className="far fa-paper-plane" 
                             style={{ 
                               fontSize: '2.2rem', 
                               color: '#6c757d' 
                             }}></i>
                        </button>
                      </div>
                      
                      {/* Like Count */}
                      <p className="mb-2">
                        <strong className="me-2" style={{ color: '#0066CC', fontSize: '1.1rem' }}>
                          <i className="fas fa-heart me-1" style={{ color: '#E91E63' }}></i>
                          {post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}
                        </strong>
                      </p>
                      <h5 className="card-title mb-2" style={{ color: '#008080' }}>{post.title}</h5>
                      
                      {/* Post content with read more functionality */}
                      {post.content.length > 150 && !expandedPosts.has(post._id) ? (
                        <div>
                          <p className="card-text">{post.content.substring(0, 150)}...</p>
                          <button 
                            className="btn btn-link p-0 text-primary" 
                            onClick={() => toggleExpandPost(post._id)}
                            style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                          >
                            Read more
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="card-text">{post.content}</p>
                          {post.content.length > 150 && (
                            <button 
                              className="btn btn-link p-0 text-primary" 
                              onClick={() => toggleExpandPost(post._id)}
                              style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Comment count */}
                      {post.comments && post.comments.length > 0 && (
                        <button 
                          className="btn btn-link p-0 text-muted mt-2 d-block" 
                          style={{ fontSize: '0.9rem' }}
                        >
                          View all {post.comments.length} comments
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Internships Feed */}
            {activeTab === 'internships' && (
              <div className="internships-feed">
                {sampleInternships.map((internship) => (
                  <div key={internship._id} className="card mb-4" style={styles.card}>
                    <div className="card-body">
                      <h5 className="card-title text-success">{internship.title}</h5>
                      <p className="card-text">{internship.description}</p>
                      <div className="mb-3">
                        <h6 className="text-success">Requirements:</h6>
                        <ul className="list-unstyled">
                          {internship.requirements.map((req, index) => (
                            <li key={index} className="mb-1">
                              <i className="fas fa-check-circle text-success me-2"></i>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <i className="fas fa-clock me-2 text-success"></i>
                            Duration: {internship.duration}
                          </p>
                          <p className="mb-1">
                            <i className="fas fa-money-bill-wave me-2 text-success"></i>
                            Stipend: {internship.stipend}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <i className="fas fa-map-marker-alt me-2 text-success"></i>
                            Location: {internship.location}
                          </p>
                          <p className="mb-1">
                            <i className="fas fa-calendar-times me-2 text-success"></i>
                            Deadline: {new Date(internship.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        className="btn btn-success w-100"
                        style={styles.buttonPrimary}
                      >
                        <i className="fas fa-paper-plane me-2"></i>
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Events Feed */}
            {activeTab === 'events' && (
              <div className="events-feed">
                {events.map((event) => (
                  <div key={event._id} className="card mb-4" style={styles.eventCard}>
                    <img
                      src={getSafeImageUrl(event.image)}
                      className="card-img-top"
                      alt={event.title}
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-success">{event.title}</h5>
                      <p className="card-text">{event.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-2">
                            <i className="far fa-calendar me-2" style={styles.icon}></i>
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="mb-2">
                            <i className="far fa-clock me-2" style={styles.icon}></i>
                            {event.time}
                          </p>
                          <p className="mb-0">
                            <i className="fas fa-map-marker-alt me-2" style={styles.icon}></i>
                            {event.location}
                          </p>
                        </div>
                        <button 
                          className="btn btn-success"
                          style={styles.buttonPrimary}
                        >
                          <i className="fas fa-user-plus me-2"></i>
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="col-md-4">
            {/* About Card */}
            <div className="card mb-4" style={styles.card}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#008080' }}>
                  <i className="fas fa-info-circle me-2"></i>
                  About
                </h5>
                <p className="card-text">{ngo.description}</p>
                <hr style={{ borderColor: 'rgba(0, 128, 128, 0.1)' }} />
                <p className="mb-3">
                  <strong style={{ color: '#008080' }}>
                    <i className="fas fa-calendar-alt me-2"></i>
                    Established:
                  </strong> {ngo.yearEstablished || '2020'}
                </p>
                <p className="mb-3">
                  <strong style={{ color: '#008080' }}>
                    <i className="fas fa-tag me-2"></i>
                    Category:
                  </strong> {ngo.category}
                </p>
                <p className="mb-0">
                  <strong style={{ color: '#008080' }}>
                    <i className="fas fa-users me-2"></i>
                    Volunteers:
                  </strong> {ngo.volunteerCount}
                </p>
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="card mb-4" style={styles.card}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#0066CC' }}>
                  <i className="fas fa-address-card me-2"></i>
                  Contact Information
                </h5>
                
                <p className="mb-3">
                  <i className="fas fa-phone-alt me-2" style={{ color: '#0066CC' }}></i>
                  <a href={`tel:${ngo.phone || "+1234567890"}`} 
                     className="hover-underline"
                     style={{ color: '#0066CC', textDecoration: 'none' }}>
                    {ngo.phone || "+1 (234) 567-890"}
                  </a>
                </p>
                
                <p className="mb-3">
                  <i className="fas fa-envelope me-2" style={{ color: '#0066CC' }}></i>
                  <a href={`mailto:${ngo.email || "contact@careconnect.org"}`}
                     className="hover-underline"
                     style={{ color: '#0066CC', textDecoration: 'none' }}>
                    {ngo.email || "contact@careconnect.org"}
                  </a>
                </p>
                
                <p className="mb-3">
                  <i className="fas fa-globe me-2" style={{ color: '#0066CC' }}></i>
                  <a href={ngo.website || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="hover-underline"
                     style={{ color: '#0066CC', textDecoration: 'none' }}>
                    {ngo.website || "www.careconnect.org"}
                  </a>
                </p>
                
                <p className="mb-4">
                  <i className="fas fa-map-marker-alt me-2" style={{ color: '#0066CC' }}></i>
                  {ngo.location}
                </p>
                
                {/* Map Link */}
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(ngo.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-100"
                  style={{
                    background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
                    color: 'white',
                    borderRadius: '25px'
                  }}
                >
                  <i className="fas fa-map-marked-alt me-2"></i>
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODetail; 