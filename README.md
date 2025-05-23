# Stockflow API Documentation

## Overview
Stockflow API adalah sistem manajemen inventaris yang menyediakan API untuk mengelola barang, transaksi barang masuk, dan barang keluar.

## Base URL
```
http://localhost:5000/api
```

## Authentication
API ini menggunakan JWT (JSON Web Token) untuk autentikasi. Token harus disertakan di header untuk protected routes.

### Auth Endpoints

#### 1. Register
```http
POST /auth/register
Content-Type: application/json

{
    "username": "string",
    "password": "string",
    "role": "string" (optional, default: "user")
}

Response: 
{
    "success": true,
    "message": "User registered successfully"
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}

Response:
{
    "success": true,
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
        "id": number,
        "username": "string",
        "role": "string"
    }
}
```

## Protected Routes
Untuk protected routes, sertakan token di header:
```http
Authorization: Bearer your_jwt_token
```

### Barang Endpoints

#### 1. Get All Barang
```http
GET /barang

Response:
{
    "success": true,
    "data": [
        {
            "id": number,
            "nama_barang": "string",
            "deskripsi": "string",
            "harga": number,
            "stok": number,
            "foto": "string"
        }
    ]
}
```

#### 2. Get Barang by ID
```http
GET /barang/:id

Response:
{
    "success": true,
    "data": {
        "id": number,
        "nama_barang": "string",
        "deskripsi": "string",
        "harga": number,
        "stok": number,
        "foto": "string"
    }
}
```

#### 3. Create Barang (Protected)
```http
POST /barang
Content-Type: multipart/form-data

Form Data:
- nama_barang: string
- deskripsi: string
- harga: number
- stok: number
- foto: file

Response:
{
    "success": true,
    "message": "Barang created successfully",
    "data": {
        "id": number,
        "nama_barang": "string",
        "deskripsi": "string",
        "harga": number,
        "stok": number,
        "foto": "string"
    }
}
```

#### 4. Update Barang (Protected)
```http
PUT /barang/:id
Content-Type: multipart/form-data

Form Data:
- nama_barang: string (optional)
- deskripsi: string (optional)
- harga: number (optional)
- stok: number (optional)
- foto: file (optional)

Response:
{
    "success": true,
    "message": "Barang updated successfully",
    "data": {
        "id": number,
        "nama_barang": "string",
        "deskripsi": "string",
        "harga": number,
        "stok": number,
        "foto": "string"
    }
}
```

#### 5. Delete Barang (Protected)
```http
DELETE /barang/:id

Response:
{
    "success": true,
    "message": "Barang deleted successfully"
}
```

### Barang Masuk Endpoints

#### 1. Get All Barang Masuk (Protected)
```http
GET /barang-masuk

Response:
{
    "success": true,    "data": [
        {
            "id_bm": number,
            "id_barang": number,
            "jumlah": number,
            "tanggal": "datetime",
            "Barang": {
                "nama_barang": "string"
            }
        }
    ]
}
```

#### 2. Create Barang Masuk (Protected)
```http
POST /barang-masuk
Content-Type: application/json

{
    "id_barang": number,
    "jumlah": number
}

Response:
{
    "success": true,
    "message": "Barang masuk recorded successfully",    "data": {
        "id_bm": number,
        "id_barang": number,
        "jumlah": number,
        "tanggal": "datetime"
    }
}
```

### Barang Keluar Endpoints

#### 1. Get All Barang Keluar (Protected)
```http
GET /barang-keluar

Response:
{
    "success": true,    "data": [
        {
            "id_bk": number,
            "id_barang": number,
            "jumlah": number,
            "jumlah_harga": number,
            "tanggal": "datetime",
            "Barang": {
                "nama_barang": "string"
            }
        }
    ]
}
```

#### 2. Create Barang Keluar (Protected)
```http
POST /barang-keluar
Content-Type: application/json

{
    "barang_id": number,
    "jumlah": number
}

Response:
{
    "success": true,
    "message": "Barang keluar recorded successfully",
    "data": {
        "id": number,
        "barang_id": number,
        "jumlah": number,
        "jumlah_harga": number,
        "tanggal": "datetime"
    }
}
```

#### 3. Get Chart Data Barang Keluar
```http
GET /barang-keluar/chart?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

Response:
{
    "success": true,
    "data": {
        "labels": ["YYYY-MM-DD", ...],
        "datasets": [{
            "label": "Jumlah Barang Keluar per Hari",
            "data": [number, ...],
            "fill": false,
            "borderColor": "#FF6384",
            "tension": 0.1
        }]
    }
}
```

## Error Responses
```json
{
    "success": false,
    "message": "Error message description"
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Flow Penggunaan API

### 1. Setup Awal
1. Register user baru
2. Login untuk mendapatkan token
3. Gunakan token untuk akses protected routes

### 2. Manajemen Barang
1. Create barang baru (dengan foto)
2. Get list barang untuk mendapatkan ID barang

### 3. Transaksi Barang Masuk
1. Create barang masuk dengan barang_id yang valid
2. Stok barang akan otomatis bertambah

### 4. Transaksi Barang Keluar
1. Create barang keluar dengan barang_id yang valid
2. Sistem akan mengecek stok mencukupi
3. Jumlah harga akan dihitung otomatis
4. Stok barang akan otomatis berkurang

### 5. Monitoring
1. Get chart data untuk visualisasi barang keluar
2. Filter data berdasarkan range tanggal