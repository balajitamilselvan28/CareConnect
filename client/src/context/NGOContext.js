import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const NGOContext = createContext();

export const useNGO = () => useContext(NGOContext);

export const NGOProvider = ({ children }) => {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all NGOs
  const getNGOs = async (category = '', search = '') => {
    try {
      console.log('Fetching NGOs...');
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`http://localhost:5001/api/ngos?category=${category}&search=${search}`);
      console.log('NGOs response:', res.data);
      
      if (res.data && Array.isArray(res.data.data)) {
        setNGOs(res.data.data);
        console.log('NGOs set to:', res.data.data);
        setLoading(false);
        return res.data;
      } else {
        console.error('Invalid response format:', res.data);
        setError('Invalid response format from server');
        setLoading(false);
        return null;
      }
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      setError(err.response?.data?.error || 'Error fetching NGOs');
      setLoading(false);
      return null;
    }
  };

  // Get single NGO
  const getNGO = async (id) => {
    try {
      console.log('NGOContext: Fetching NGO with ID:', id);
      setLoading(true);
      setError(null);
      
      if (!id) {
        console.error('NGOContext: Invalid NGO ID - ID is undefined or null');
        setError('Invalid NGO ID');
        setLoading(false);
        return { error: 'Invalid NGO ID' };
      }
      
      // Check if ID is a valid MongoDB ObjectId format
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        console.error('NGOContext: Invalid NGO ID format:', id);
        setError('Invalid NGO ID format');
        setLoading(false);
        return { error: 'Invalid NGO ID format' };
      }
      
      // Use the API URL from the environment if available, otherwise use the hardcoded URL
      const apiUrl = `http://localhost:5001/api/ngos/${id}`;
      console.log('NGOContext: Making API request to:', apiUrl);
      
      // Add a timeout to the request
      const res = await axios.get(apiUrl, { timeout: 10000 });
      console.log('NGOContext: NGO response status:', res.status);
      console.log('NGOContext: NGO response data:', res.data);
      
      if (res.data && res.data.data) {
        console.log('NGOContext: Valid NGO data received');
        setLoading(false);
        return res.data;
      } else {
        console.error('NGOContext: Invalid NGO response format:', res.data);
        setError('Invalid response format from server');
        setLoading(false);
        return { error: 'Invalid response format from server' };
      }
    } catch (err) {
      console.error('NGOContext: Error fetching NGO:', err);
      
      // Log detailed error information
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('NGOContext: Error response data:', err.response.data);
        console.error('NGOContext: Error response status:', err.response.status);
        console.error('NGOContext: Error response headers:', err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('NGOContext: No response received, request:', err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('NGOContext: Error message:', err.message);
      }
      
      const errorMessage = err.response?.data?.error || err.message || 'Error fetching NGO details';
      console.error('NGOContext: Final error message:', errorMessage);
      
      setError(errorMessage);
      setLoading(false);
      return { error: errorMessage };
    }
  };

  // Create NGO (admin only)
  const createNGO = async (ngoData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/ngos', ngoData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNGOs([...ngos, res.data.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating NGO');
      throw err;
    }
  };

  // Update NGO (admin only)
  const updateNGO = async (id, ngoData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/api/ngos/${id}`, ngoData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNGOs(ngos.map(ngo => ngo._id === id ? res.data.data : ngo));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating NGO');
      throw err;
    }
  };

  // Delete NGO (admin only)
  const deleteNGO = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/ngos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNGOs(ngos.filter(ngo => ngo._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting NGO');
      throw err;
    }
  };

  // Load NGOs on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getNGOs();
      } catch (error) {
        console.error('Failed to load initial NGO data:', error);
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  return (
    <NGOContext.Provider
      value={{
        ngos,
        loading,
        error,
        getNGOs,
        getNGO,
        createNGO,
        updateNGO,
        deleteNGO
      }}
    >
      {children}
    </NGOContext.Provider>
  );
}; 