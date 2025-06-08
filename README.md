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
        "id_admin": number,
        "username": "string",
        "nama_lengkap": "string",
        "email": "string",
        "role": "string",
        "foto": "string"
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
    "success": true,    "data": [
        {
            "id_barang": number,
            "nama_barang": "string",
            "kategori": "string",
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
        "id_barang": number,
        "nama_barang": "string",
        "kategori": "string",
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
- kategori: string
- harga: number
- stok: number
- foto: file

Response:
{
    "success": true,
    "message": "Barang created successfully",
    "data": {
        "id_barang": number,
        "nama_barang": "string",
        "kategori": "string",
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
- kategori: string (optional)
- harga: number (optional)
- stok: number (optional)
- foto: file (optional)

Response:
{
    "success": true,
    "message": "Barang updated successfully",
    "data": {
        "id_barang": number,
        "nama_barang": "string",
        "kategori": "string",
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
    "id_barang": number,
    "jumlah": number
}

Response:
{
    "success": true,
    "message": "Barang keluar recorded successfully",    "data": {
        "id_bk": number,
        "id_barang": number,
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

### Dashboard Endpoints

#### 1. Get Dashboard Summary (Protected)

```http
GET /dashboard/summary

Response:
{
    "success": true,
    "data": {
        "totalBarang": number,
        "totalStok": number,
        "totalMasukHariIni": number,
        "totalKeluarHariIni": number,
        "totalNilai": number
    }
}
```

#### 2. Get Barang by Kategori Chart

```http
GET /dashboard/chart/barang

Response:
{
    "success": true,
    "data": {
        "labels": ["Daster", "Gamis", "Kaftan", ...],
        "datasets": [{
            "label": "Jumlah Barang per Kategori",
            "data": [10, 15, 8, ...],
            "backgroundColor": [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF"
            ]
        }]
    }
}
```

#### 3. Get Barang Masuk Chart

```http
GET /dashboard/chart/barang-masuk?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

Response:
{
    "success": true,
    "data": {
        "labels": ["YYYY-MM-DD", ...],
        "datasets": [{
            "label": "Jumlah Barang Masuk per Hari",
            "data": [50, 45, 60, ...],
            "fill": false,
            "borderColor": "#36A2EB",
            "tension": 0.1
        }]
    }
}
```

#### 4. Get Barang Keluar Chart

```http
GET /dashboard/chart/barang-keluar?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

Response:
{
    "success": true,
    "data": {
        "labels": ["YYYY-MM-DD", ...],
        "datasets": [{
            "label": "Jumlah Barang Keluar per Hari",
            "data": [30, 25, 40, ...],
            "fill": false,
            "borderColor": "#FF6384",
            "tension": 0.1
        }]
    }
}
```

## Flow Penggunaan API

### 1. Setup Awal

1. Register user baru
2. Login untuk mendapatkan token
3. Gunakan token untuk akses protected routes

### 2. Manajemen Barang

1. Create barang baru (dengan foto)
2. Get list barang untuk mendapatkan ID barang

### 3. Transaksi Barang Masuk

1. Create barang masuk dengan id_barang yang valid
2. Stok barang akan otomatis bertambah

### 4. Transaksi Barang Keluar

1. Create barang keluar dengan id_barang yang valid
2. Sistem akan mengecek stok mencukupi
3. Jumlah harga akan dihitung otomatis
4. Stok barang akan otomatis berkurang

### 5. Monitoring

1. Akses dashboard endpoints untuk visualisasi data
2. Gunakan filter tanggal untuk melihat data dalam rentang waktu tertentu
3. Lihat ringkasan dashboard untuk informasi keseluruhan stok dan transaksi

## Instalasi dan Setup

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- npm atau yarn

### Langkah Instalasi

1. Clone repository
```bash
git clone https://github.com/username/stockflow-api.git
cd stockflow-api
```

2. Install dependencies
```bash
npm install
```

3. Setup database
   - Buat database MySQL baru bernama `stockflow`
   - Import schema dari file `stockflow-terbaru.sql`

4. Setup environment variables
   - Copy file `.env.example` menjadi `.env`
   - Sesuaikan konfigurasi database pada file `.env`

5. Jalankan database migration (untuk update struktur tabel)
```bash
npm run migrate
```

6. Jalankan aplikasi
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Struktur Database

### 1. Barang
- `id_barang` (INT, PK): Primary key
- `nama_barang` (VARCHAR): Nama barang
- `kategori` (VARCHAR): Kategori barang
- `harga` (INT): Harga per unit
- `stok` (INT): Jumlah stok
- `foto` (VARCHAR): Nama file foto
- `created_at` (TIMESTAMP): Waktu pembuatan

### 2. Barang Masuk
- `id_bm` (INT, PK): Primary key
- `id_barang` (INT, FK): Foreign key ke tabel barang
- `jumlah` (INT): Jumlah barang masuk
- `tanggal` (DATE): Tanggal transaksi

### 3. Barang Keluar
- `id_bk` (INT, PK): Primary key
- `id_barang` (INT, FK): Foreign key ke tabel barang
- `jumlah` (INT): Jumlah barang keluar
- `jumlah_harga` (DECIMAL): Total harga (jumlah × harga barang)
- `tanggal` (DATE): Tanggal transaksi

### Profile Endpoints

#### 1. Get Profile (Protected)

```http
GET /profile

Response:
{
    "success": true,
    "data": {
        "id_admin": number,
        "nama_lengkap": "string",
        "username": "string",
        "email": "string",
        "foto": "string",
        "role": "string"
    }
}
```

#### 2. Update Profile (Protected)

```http
PUT /profile
Content-Type: multipart/form-data

Form Data:
- nama_lengkap: string (optional)
- username: string (optional)
- email: string (optional)
- foto: file (optional)

Response:
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id_admin": number,
        "nama_lengkap": "string",
        "username": "string",
        "email": "string",
        "foto": "string",
        "role": "string"
    }
}
```

#### 3. Change Password (Protected)

```http
PUT /profile/change-password
Content-Type: application/json

{
    "oldPassword": "string",
    "newPassword": "string"
}

Response:
{
    "success": true,
    "message": "Password changed successfully"
}
```

#### 4. Upload Profile Photo (Protected)

```http
POST /profile/photo
Content-Type: multipart/form-data

Form Data:
- foto: file

Response:
{
    "success": true,
    "message": "Profile photo uploaded successfully",
    "data": {
        "foto": "string"
    }
}
```
