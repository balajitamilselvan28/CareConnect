const axios = require('axios');
require('dotenv').config();

const testNGOApi = async () => {
  try {
    console.log('Testing NGO API...');
    
    // Test GET /api/ngos
    console.log('\nTesting GET /api/ngos');
    const allNgosRes = await axios.get('http://localhost:5001/api/ngos');
    console.log('Status:', allNgosRes.status);
    console.log('Data count:', allNgosRes.data.count);
    
    if (allNgosRes.data.count > 0) {
      const firstNgoId = allNgosRes.data.data[0]._id;
      console.log('First NGO ID:', firstNgoId);
      
      // Test GET /api/ngos/:id
      console.log('\nTesting GET /api/ngos/' + firstNgoId);
      const singleNgoRes = await axios.get(`http://localhost:5001/api/ngos/${firstNgoId}`);
      console.log('Status:', singleNgoRes.status);
      console.log('NGO name:', singleNgoRes.data.data.name);
      console.log('NGO data:', singleNgoRes.data.data);
    }
    
    console.log('\nAPI tests completed successfully');
  } catch (error) {
    console.error('Error testing API:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

testNGOApi();