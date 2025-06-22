# Dashboard API Documentation

This document provides information about the Dashboard API endpoints available in the StockFlow API.

## Endpoints

### 1. Get Dashboard Summary
**Endpoint:** `GET /api/dashboard/summary`  
**Authentication:** Required  
**Description:** Returns a summary of inventory statistics.

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "totalBarang": 100,
    "totalBarangMasuk": 1000,
    "totalBarangKeluar": 800,
    "inventoryValue": 20000000,
    "totalCategories": 5,
    "topSellingItems": [
      {
        "nama_barang": "Daster",
        "total_keluar": 50
      },
      {
        "nama_barang": "Mukena",
        "total_keluar": 30
      }
    ]
  }
}
```

### 2. Get Barang by Kategori Chart
**Endpoint:** `GET /api/dashboard/chart/barang`  
**Authentication:** Required  
**Description:** Returns data for visualizing distribution of items by category.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "kategori": "Daster",
      "jumlah": 15
    },
    {
      "kategori": "Mukena",
      "jumlah": 10
    },
    {
      "kategori": "Gamis",
      "jumlah": 8
    }
  ]
}
```

### 3. Get Barang Masuk Chart
**Endpoint:** `GET /api/dashboard/chart/barang-masuk?startDate=2025-01-01&endDate=2025-12-31`  
**Authentication:** Required  
**Description:** Returns data for visualizing incoming items over time.

**Query Parameters:**
- `startDate` (optional): Filter data from this date (YYYY-MM-DD)
- `endDate` (optional): Filter data until this date (YYYY-MM-DD)

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "tanggal": "2025-04-01",
      "total_barang_masuk": 20
    },
    {
      "tanggal": "2025-04-02",
      "total_barang_masuk": 15
    }
  ]
}
```

### 4. Get Barang Keluar Chart
**Endpoint:** `GET /api/dashboard/chart/barang-keluar?startDate=2025-01-01&endDate=2025-12-31`  
**Authentication:** Required  
**Description:** Returns data for visualizing outgoing items over time.

**Query Parameters:**
- `startDate` (optional): Filter data from this date (YYYY-MM-DD)
- `endDate` (optional): Filter data until this date (YYYY-MM-DD)

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "tanggal": "2025-04-01",
      "total_barang_keluar": 10
    },
    {
      "tanggal": "2025-04-02",
      "total_barang_keluar": 12
    }
  ]
}
```

## Using the Dashboard API

To use these endpoints in a frontend application:

1. Ensure you have a valid JWT token by authenticating with `/api/auth/login`
2. Include the token in the Authorization header when making requests
3. Use the data returned to create visualizations such as:
   - Summary statistics and cards
   - Pie charts for category distribution
   - Line or bar charts for time-series data
   - Top products tables

Example request using JavaScript:

```javascript
const fetchDashboardData = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/dashboard/summary', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  // Use the data to populate dashboard UI
};
```
