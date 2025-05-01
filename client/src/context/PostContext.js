import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all posts
  const getPosts = async (ngo = '') => {
    try {
      const res = await axios.get(`http://localhost:5001/api/posts?ngo=${ngo}`);
      setPosts(res.data.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching posts');
      throw err;
    }
  };

  // Get single post
  const getPost = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/posts/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching post');
      throw err;
    }
  };

  // Create post (admin only)
  const createPost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts([...posts, res.data.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating post');
      throw err;
    }
  };

  // Update post (admin only)
  const updatePost = async (id, postData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/api/posts/${id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.map(post => post._id === id ? res.data.data : post));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating post');
      throw err;
    }
  };

  // Delete post (admin only)
  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting post');
      throw err;
    }
  };

  // Load posts on mount
  useEffect(() => {
    getPosts()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        getPosts,
        getPost,
        createPost,
        updatePost,
        deletePost
      }}
    >
      {children}
    </PostContext.Provider>
  );
}; 