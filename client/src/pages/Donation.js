import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ngoLogo from '../ngo center logo.jpg';

const Donation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNGO } = useNGO();
  const { user } = useAuth();
  const [ngo, setNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [donationResponse, setDonationResponse] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    paymentDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        if (!id) {
          setError('Invalid NGO ID');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`http://localhost:5001/api/ngos/${id}`);
        
        if (response.data && response.data.success && response.data.data) {
          setNGO(response.data.data);
        } else {
          setError('Failed to load NGO data');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load NGO data. Please try again.');
        setLoading(false);
      }
    };

    fetchNGO();
  }, [id]);

  const onChange = (e) => {
    if (e.target.name.startsWith('paymentDetails.')) {
      const field = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        paymentDetails: {
          ...formData.paymentDetails,
          [field]: e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Generate PDF receipt
  const generateReceipt = () => {
    try {
      if (!donationResponse || !ngo) {
        console.error('Missing donation response or NGO data for receipt generation');
        return;
      }
      
      console.log('Generating receipt with data:', donationResponse);
    
      // Create PDF document
      const doc = new jsPDF();
      const donation = donationResponse;
      const currentDate = new Date().toLocaleDateString();
    
      // Generate a receipt number
      let receiptNumber;
      try {
        receiptNumber = donation._id ? donation._id.substring(0, 8).toUpperCase() : 
                       'R' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
      } catch (err) {
        console.error('Error generating receipt number:', err);
        receiptNumber = 'R' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
      }
    
      // Add border
      doc.setDrawColor(0, 128, 128); // Teal border
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 200, 287);
    
      // Add logo image at the center top of the page
      try {
        const centerX = 105; // Center of the page (A4 width is 210mm)
        const topY = 20;     // Top position
        const logoWidth = 50;
        const logoHeight = 25;
        
        // Add the imported logo image to the PDF
        doc.addImage(ngoLogo, 'JPEG', centerX - logoWidth/2, topY - logoHeight/2, logoWidth, logoHeight);
        console.log('Logo added to PDF successfully');
      } catch (logoError) {
        console.error('Error adding logo:', logoError);
        // Fallback to a simple text-based logo if image loading fails
        doc.setFontSize(16);
        doc.setTextColor(0, 128, 128); // Teal
        doc.text('CareConnect', 105, 20, { align: 'center' });
      }
    
      // Add header text below the logo
      doc.setFontSize(22);
      doc.setTextColor(0, 128, 128); // Teal color
      doc.text('Donation Receipt', 105, 50, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204); // Blue color
      doc.text('Thank you for your contribution', 105, 60, { align: 'center' });
      
      // Add decorative line
      doc.setDrawColor(0, 128, 128); // Teal
      doc.setLineWidth(0.5);
      doc.line(20, 65, 190, 65);
      
      // Add receipt details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Receipt #: ${receiptNumber}`, 20, 75);
      doc.text(`Date: ${currentDate}`, 20, 82);
      
      // Add NGO information section
      doc.setDrawColor(0, 128, 128); // Teal border
      doc.rect(15, 90, 180, 40);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204); // Blue color
      doc.text('NGO Information', 20, 100);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Safely access NGO data with fallbacks
      const ngoName = ngo.name || 'NGO Name';
      const ngoLocation = ngo.location || 'Location not specified';
      const ngoCategory = ngo.category || 'Category not specified';
      
      doc.text(`Name: ${ngoName}`, 25, 110);
      doc.text(`Location: ${ngoLocation}`, 25, 118);
      doc.text(`Category: ${ngoCategory}`, 25, 126);
    
      // Add donor information section
      doc.setDrawColor(0, 128, 128); // Teal border
      doc.rect(15, 140, 180, 40);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0); // Green color
      doc.text('Donor Information', 20, 150);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Safely access donor data with fallbacks
      const donorName = donation.name || 'Donor';
      const donorEmail = donation.email || 'Email not provided';
      const donorPhone = donation.phone || 'Phone not provided';
      
      doc.text(`Name: ${donorName}`, 25, 160);
      doc.text(`Email: ${donorEmail}`, 25, 168);
      doc.text(`Phone: ${donorPhone}`, 25, 176);
      
      // Add payment information section
      doc.setDrawColor(0, 128, 128); // Teal border
      doc.rect(15, 190, 180, 40);
      
      doc.setFontSize(14);
      doc.setTextColor(75, 0, 130); // Indigo color
      doc.text('Payment Information', 20, 200);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Handle potential missing data with safe defaults
      const amount = donation.amount || '0';
      doc.text(`Amount: $${amount}`, 25, 210);
      doc.text(`Payment Method: Credit Card`, 25, 218);
      
      // Safely access card number
      let lastFourDigits = 'XXXX';
      try {
        if (donation.paymentDetails && donation.paymentDetails.cardNumber) {
          lastFourDigits = donation.paymentDetails.cardNumber.slice(-4);
        }
      } catch (err) {
        console.error('Error accessing card number:', err);
      }
      
      doc.text(`Card Number: XXXX-XXXX-XXXX-${lastFourDigits}`, 25, 226);
    
      // Add thank you message
      doc.setDrawColor(0, 128, 128); // Teal border
      doc.roundedRect(40, 240, 130, 25, 3, 3);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0); // Green color
      doc.text('Thank you for your generous donation!', 105, 250, { align: 'center' });
      doc.setFontSize(11);
      doc.text('Your contribution helps us make a difference.', 105, 258, { align: 'center' });
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(0, 102, 102); // Dark teal color
      doc.text('CareConnect - Connecting Hearts, Changing Lives', 105, 270, { align: 'center' });
      doc.text('This receipt is generated electronically and is valid for tax purposes.', 105, 278, { align: 'center' });
      
      // Add QR code-like element (just for visual appeal)
      doc.setDrawColor(0, 128, 128);
      doc.roundedRect(170, 260, 20, 20, 2, 2);
      doc.setFillColor(0, 128, 128);
      doc.roundedRect(175, 265, 10, 10, 1, 1, 'F');
      
      // Save the PDF
      doc.save(`CareConnect_Donation_Receipt_${receiptNumber}.pdf`);
      
      return true; // Indicate success
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      return false; // Indicate failure
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const donationData = {
        ...formData,
        ngo: id,
        user: user.id || user._id
      };
      
      console.log('Submitting donation:', donationData);
      
      const response = await axios.post(
        'http://localhost:5001/api/donations',
        donationData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Donation response:', response.data);
      
      // Store the donation response for receipt generation
      // Handle different response structures
      let processedDonation;
      if (response.data && response.data.data) {
        processedDonation = response.data.data;
      } else if (response.data) {
        processedDonation = response.data;
      } else {
        // Create a minimal donation object if response structure is unexpected
        processedDonation = {
          ...formData,
          _id: 'TEMP' + Date.now(),
          amount: formData.amount,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          paymentDetails: formData.paymentDetails
        };
      }
      
      console.log('Processed donation data for receipt:', processedDonation);
      setDonationResponse(processedDonation);
      setSuccess(true);
      
      // Generate receipt automatically after a short delay
      // This gives time for the success message to display
      // Wait 3 seconds before generating the receipt to ensure state is updated
      setTimeout(() => {
        console.log('Generating receipt for donation:', processedDonation);
        
        const receiptSuccess = generateReceipt();
        console.log('Receipt generation result:', receiptSuccess ? 'Success' : 'Failed');
        
        // Don't navigate automatically - let user manually return or download receipt again
        // This gives them time to see the receipt has been generated
      }, 3000);
      
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.response?.data?.error || 'Failed to process donation. Please try again.');
    }
  };

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
          <h4 className="alert-heading">Error Loading Donation Information</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            {' '}
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => navigate(`/ngo/${id}`)}
            >
              Back to NGO
            </button>
          </p>
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

  if (success) {
    return (
      <div className="container mt-5">
        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              <i className="fas fa-check-circle me-2"></i>
              Donation Successful!
            </h4>
          </div>
          <div className="card-body">
            <div className="text-center mb-4">
              <div className="display-1 text-success mb-3">
                <i className="fas fa-file-pdf"></i>
              </div>
              <h5>Thank you for your generous donation to {ngo?.name || 'this organization'}!</h5>
              <p className="text-muted">
                Your e-receipt is being generated and will download automatically in a few seconds.
              </p>
              <div className="spinner-border text-success mt-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-outline-success" 
                onClick={generateReceipt}
              >
                <i className="fas fa-file-pdf me-2"></i>
                Download Receipt Again
              </button>
              <button 
                className="btn btn-outline-primary" 
                onClick={() => navigate(`/ngo/${id}`)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Return to NGO Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Donate to {ngo.name}</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Donation Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={onChange}
                    required
                    min="1"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    name="paymentDetails.cardNumber"
                    value={formData.paymentDetails.cardNumber}
                    onChange={onChange}
                    required
                    pattern="[0-9]{16}"
                    maxLength="16"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiryDate" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="expiryDate"
                      name="paymentDetails.expiryDate"
                      value={formData.paymentDetails.expiryDate}
                      onChange={onChange}
                      required
                      placeholder="MM/YY"
                      pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                      maxLength="5"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      name="paymentDetails.cvv"
                      value={formData.paymentDetails.cvv}
                      onChange={onChange}
                      required
                      pattern="[0-9]{3,4}"
                      maxLength="4"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Donate Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation; 