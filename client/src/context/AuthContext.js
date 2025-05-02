import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  // Logout user - defined first to avoid reference errors
  const logout = useCallback(() => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Reset user state
      setUser(null);
      // Reset any error state
      setError(null);
      console.log('User logged out successfully');
      
      // Clear any other stored user data if needed
      // For example, if you're using sessionStorage or cookies
      sessionStorage.removeItem('user');
      
      // You could also make a backend call to invalidate the token if needed
      // This is optional and depends on your backend implementation
      // const invalidateToken = async () => {
      //   try {
      //     await axios.post('http://localhost:5001/api/auth/logout');
      //   } catch (err) {
      //     console.error('Error invalidating token:', err);
      //   }
      // };
      // invalidateToken();
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }, []);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token in localStorage:', token ? 'exists' : 'not found');
        
        if (!token) {
          console.log('No token found, setting user to null');
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('Attempting to load user with token');
        const res = await axios.get('http://localhost:5001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.data && res.data.data) {
          console.log('User loaded successfully:', res.data.data);
          setUser(res.data.data);
          
          // Double-check that user state was updated
          setTimeout(() => {
            console.log('User state after loading:', user);
          }, 100);
        } else {
          console.error('Invalid user data format:', res.data);
          localStorage.removeItem('token');
          setUser(null);
          setError('Invalid user data format. Please login again.');
        }
      } catch (err) {
        console.error('Error loading user:', err);
        // If token is invalid or expired, remove it and reset user state
        localStorage.removeItem('token');
        setUser(null);
        setError(err.response?.data?.error || 'Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    console.log('AuthContext useEffect running - loading user');
    loadUser();
    
    // Set up an interval to check token validity periodically
    // This helps ensure the user is logged out if their token expires
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && user) {
        // Verify token is still valid
        axios.get('http://localhost:5001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(err => {
          console.log('Token validation failed:', err);
          // If token is invalid, log the user out
          logout();
        });
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [logout]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
        // Fetch user data after registration
        try {
          const userRes = await axios.get('http://localhost:5001/api/auth/me', {
            headers: {
              Authorization: `Bearer ${res.data.token}`
            }
          });
        setUser(userRes.data.data);
        } catch (userErr) {
          console.error('Error fetching user after registration:', userErr);
        }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error registering user');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('Login attempt with:', userData);
      
      // First, attempt to login
      const res = await axios.post('http://localhost:5001/api/auth/login', userData);
      console.log('Login response:', res.data);
      
      if (res.data && res.data.token) {
        // Store the token
        localStorage.setItem('token', res.data.token);
        console.log('Token stored in localStorage');
        
        // If the login response already includes user data, use it
        if (res.data.data) {
          console.log('User data found in login response:', res.data.data);
          // Set the user state
          setUser(res.data.data);
          console.log('User state set from login response');
          
          // Double-check that user state was updated
          setTimeout(() => {
            console.log('User state after setting:', user);
          }, 100);
          
          return { ...res.data, userData: res.data.data };
        }
        
        // Otherwise, fetch user data after login
        try {
          console.log('Fetching user data with token:', res.data.token);
          const userRes = await axios.get('http://localhost:5001/api/auth/me', {
            headers: {
              Authorization: `Bearer ${res.data.token}`
            }
          });
          
          console.log('User data response:', userRes.data);
          
          if (userRes.data && userRes.data.data) {
            // Set the user state
            setUser(userRes.data.data);
            console.log('User state set from /me endpoint');
            
            // Double-check that user state was updated
            setTimeout(() => {
              console.log('User state after setting:', user);
            }, 100);
            
            return { ...res.data, userData: userRes.data.data };
          } else {
            console.error('Invalid user data format:', userRes.data);
            throw new Error('Invalid user data format');
          }
        } catch (userErr) {
          console.error('Error fetching user after login:', userErr);
          // If we can't fetch the user, we should clear the token
          localStorage.removeItem('token');
          throw new Error('Error fetching user data');
        }
      } else {
        console.error('Invalid login response format:', res.data);
        throw new Error('Invalid login response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error logging in';
      setError(errorMessage);
      throw err;
    }
  };

  // Function to manually refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found during manual refresh');
        return null;
      }
      
      console.log('Manual refresh: Attempting to load user with token');
      const res = await axios.get('http://localhost:5001/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data && res.data.data) {
        console.log('Manual refresh: User loaded successfully:', res.data.data);
        setUser(res.data.data);
        return res.data.data;
      } else {
        console.error('Manual refresh: Invalid user data format:', res.data);
        return null;
      }
    } catch (err) {
      console.error('Manual refresh: Error loading user:', err);
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 