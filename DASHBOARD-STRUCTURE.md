# Dashboard Structure

This document outlines the structure and data flow of the dashboard feature in the StockFlow API.

## API Endpoints

1. `GET /api/dashboard/summary`
   - Purpose: Retrieve summary statistics for the dashboard
   - Authentication: Required
   - Data: Total items, total incoming/outgoing, inventory value, etc.

2. `GET /api/dashboard/chart/barang`
   - Purpose: Get data for visualizing items by category
   - Authentication: Required
   - Data: Categories and item counts

3. `GET /api/dashboard/chart/barang-masuk`
   - Purpose: Get time-series data for incoming items
   - Authentication: Required
   - Optional query parameters: startDate, endDate
   - Data: Dates and quantities

4. `GET /api/dashboard/chart/barang-keluar`
   - Purpose: Get time-series data for outgoing items
   - Authentication: Required
   - Optional query parameters: startDate, endDate
   - Data: Dates and quantities

## Database Queries

The dashboard feature primarily uses the following database tables:

1. `barang`: For item information and inventory value
2. `barang_masuk`: For incoming inventory transactions
3. `barang_keluar`: For outgoing inventory transactions

## Implementation Flow

1. Client sends authenticated request to dashboard endpoint
2. Server verifies JWT token via authMiddleware
3. dashboardController executes appropriate database queries
4. Data is processed and formatted for frontend visualization
5. Response sent as JSON

## Frontend Integration Guide

To integrate the dashboard API with a frontend:

1. Authentication:
   ```javascript
   const token = localStorage.getItem('token');
   const headers = { Authorization: `Bearer ${token}` };
   ```

2. Fetching summary data:
   ```javascript
   const response = await fetch('/api/dashboard/summary', { headers });
   const data = await response.json();
   ```

3. Creating charts:
   ```javascript
   // Using a library like Chart.js
   const response = await fetch('/api/dashboard/chart/barang', { headers });
   const { data } = await response.json();
   
   // Example with Chart.js
   new Chart(ctx, {
     type: 'pie',
     data: {
       labels: data.map(item => item.kategori),
       datasets: [{
         data: data.map(item => item.jumlah),
         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', /* more colors */]
       }]
     }
   });
   ```

4. Using date filters:
   ```javascript
   const startDate = '2025-01-01';
   const endDate = '2025-12-31';
   const response = await fetch(
     `/api/dashboard/chart/barang-masuk?startDate=${startDate}&endDate=${endDate}`, 
     { headers }
   );
   const data = await response.json();
   ```
