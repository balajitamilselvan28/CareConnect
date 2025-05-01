import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Card,
  Button,
  Spinner,
  Alert,
  SectionTitle,
  InfoItem,
  Image,
  H1,
  H2,
  Text,
  Divider
} from '../components/common/UIComponents';
import { commonStyles } from '../styles/theme';

const MyNGO = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ngo, setNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.token) {
          navigate('/login', { state: { from: '/my-ngo' } });
          return;
        }

        const response = await axios.get('http://localhost:5001/api/ngos/my-ngo', {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setNGO(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch NGO data');
        }
      } catch (err) {
        console.error('Error fetching NGO:', err);
        setError(err.response?.data?.message || 'Failed to fetch NGO data');
      } finally {
        setLoading(false);
      }
    };

    fetchNGO();
  }, [user, navigate]);

  if (loading) {
    return (
      <div style={commonStyles.container}>
        <div className="text-center">
          <Spinner size="large" />
          <Text className="mt-3">Loading your NGO profile...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={commonStyles.container}>
        <Alert type="danger" message={error} />
        <div className="text-center mt-3">
          <Button 
            variant="primary"
            onClick={() => navigate('/create-ngo')}
            icon="fas fa-plus"
          >
            Create NGO Profile
          </Button>
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div style={commonStyles.container}>
        <Alert 
          type="info" 
          message="You haven't created an NGO profile yet. Click below to create one!"
        />
        <div className="text-center mt-3">
          <Button 
            variant="primary"
            onClick={() => navigate('/create-ngo')}
            icon="fas fa-plus"
          >
            Create NGO Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={commonStyles.container}>
      <div className="row">
        {/* Profile Card */}
        <div className="col-md-4 mb-4">
          <Card>
            <div className="text-center">
              <Image
                src={ngo.photo || 'https://via.placeholder.com/200'}
                alt={ngo.name}
                className="rounded-circle mb-3"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
              <H2>{ngo.name}</H2>
              <Text className="text-muted">{ngo.slogan}</Text>
            </div>
            <Divider />
            <div className="d-grid gap-2">
              <Button 
                variant="primary"
                icon="fas fa-edit"
                onClick={() => navigate(`/edit-ngo/${ngo._id}`)}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline"
                icon="fas fa-newspaper"
                onClick={() => navigate(`/manage-posts/${ngo._id}`)}
              >
                Manage Posts
              </Button>
              <Button 
                variant="outline"
                icon="fas fa-calendar"
                onClick={() => navigate(`/manage-events/${ngo._id}`)}
              >
                Manage Events
              </Button>
              <Button 
                variant="outline"
                icon="fas fa-briefcase"
                onClick={() => navigate(`/manage-internships/${ngo._id}`)}
              >
                Manage Internships
              </Button>
            </div>
          </Card>
        </div>

        {/* NGO Overview */}
        <div className="col-md-8">
          <Card>
            <H1 className="mb-4">NGO Overview</H1>
            
            <SectionTitle icon="fas fa-map-marker-alt">Location</SectionTitle>
            <Text>{ngo.location}</Text>
            
            <SectionTitle icon="fas fa-tag" className="mt-4">Category</SectionTitle>
            <Text>{ngo.category}</Text>
            
            <SectionTitle icon="fas fa-users" className="mt-4">Volunteers</SectionTitle>
            <Text>{ngo.volunteerCount || 0} volunteers</Text>
            
            <SectionTitle icon="fas fa-globe" className="mt-4">Website</SectionTitle>
            <Text>
              <a href={ngo.website} target="_blank" rel="noopener noreferrer">
                {ngo.website}
              </a>
            </Text>
            
            <SectionTitle icon="fas fa-envelope" className="mt-4">Contact</SectionTitle>
            <InfoItem 
              icon="fas fa-envelope" 
              label="Email" 
              value={ngo.email} 
            />
            <InfoItem 
              icon="fas fa-phone" 
              label="Phone" 
              value={ngo.phone} 
            />
            
            <SectionTitle icon="fas fa-info-circle" className="mt-4">About</SectionTitle>
            <Text>{ngo.description}</Text>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyNGO; 