import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { NGOProvider } from './context/NGOContext';
import { PostProvider } from './context/PostContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import NGODetail from './pages/NGODetail';
import Donation from './pages/Donation';
import Volunteer from './pages/Volunteer';
import VolunteerCart from './pages/VolunteerCart';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <NGOProvider>
        <PostProvider>
          <Router>
            <div className="App">
              <ToastContainer />
              <Navbar />
              <div>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/ngo/:id" element={<NGODetail />} />
                  <Route
                    path="/donation/:id"
                    element={
                      <PrivateRoute>
                        <Donation />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/volunteer/:id"
                    element={
                      <PrivateRoute>
                        <Volunteer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/volunteer-cart"
                    element={
                      <PrivateRoute>
                        <VolunteerCart />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </Router>
        </PostProvider>
      </NGOProvider>
    </AuthProvider>
  );
}

export default App;
