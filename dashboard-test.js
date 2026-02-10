// dashboard-test.js
// Script to test dashboard endpoints

const axios = require('axios');
require('dotenv').config();

const API_URL = `http://localhost:${process.env.PORT || 5000}`;
let token;

// Function to login and get token
async function login() {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'kelompok2@mail.com',
      password: 'admin123' // Change this to match your admin password
    });

    if (response.data && response.data.token) {
      console.log('Login successful');
      return response.data.token;
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Function to test dashboard endpoints
async function testDashboardEndpoints(token) {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    console.log('\n--- Testing Dashboard Summary ---');
    const summaryResponse = await axios.get(`${API_URL}/api/dashboard/summary`, { headers });
    console.log('Summary data:', JSON.stringify(summaryResponse.data, null, 2));

    console.log('\n--- Testing Barang by Kategori Chart ---');
    const kategoriResponse = await axios.get(`${API_URL}/api/dashboard/chart/barang`, { headers });
    console.log('Kategori data:', JSON.stringify(kategoriResponse.data, null, 2));

    console.log('\n--- Testing Barang Masuk Chart ---');
    const barangMasukResponse = await axios.get(`${API_URL}/api/dashboard/chart/barang-masuk`, { headers });
    console.log('Barang Masuk data:', JSON.stringify(barangMasukResponse.data, null, 2));

    console.log('\n--- Testing Barang Keluar Chart ---');
    const barangKeluarResponse = await axios.get(`${API_URL}/api/dashboard/chart/barang-keluar`, { headers });
    console.log('Barang Keluar data:', JSON.stringify(barangKeluarResponse.data, null, 2));

    // Test with date filters
    console.log('\n--- Testing Barang Masuk Chart with Date Filters ---');
    const startDate = '2025-01-01';
    const endDate = '2025-12-31';
    const filteredBarangMasukResponse = await axios.get(
      `${API_URL}/api/dashboard/chart/barang-masuk?startDate=${startDate}&endDate=${endDate}`,
      { headers }
    );
    console.log('Filtered Barang Masuk data:', JSON.stringify(filteredBarangMasukResponse.data, null, 2));

    console.log('\n--- All tests completed successfully ---');
  } catch (error) {
    console.error('Test error:', error.response?.data || error.message);
  }
}

// Main execution
(async () => {
  try {
    // Get token
    token = await login();

    // Run tests
    await testDashboardEndpoints(token);
  } catch (error) {
    console.error('Test script error:', error.message);
  }
})();
