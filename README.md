# Dokumentasi API StockFlow - Toko Fashion Daster Maura

## Tentang Aplikasi

StockFlow API adalah sistem manajemen inventaris untuk produk fashion seperti Daster Maura dan Gamis Hitam. API ini membantu pengelola toko untuk melacak stok barang, mengelola transaksi barang masuk dan keluar, serta memantau perkembangan penjualan melalui dashboard.

## Daftar Isi
1. [Instalasi](#instalasi)
2. [Konfigurasi](#konfigurasi)
3. [API Endpoints](#api-endpoints)
   - [Autentikasi](#autentikasi)
   - [Barang](#barang)
   - [Barang Masuk](#barang-masuk)
   - [Barang Keluar](#barang-keluar)
   - [Dashboard](#dashboard)
   - [Profil](#profil)
4. [Panduan Pengujian di Postman](#panduan-pengujian-di-postman)
5. [Contoh Penggunaan](#contoh-penggunaan)

## Instalasi

1. Clone repositori ini ke komputer Anda
```bash
git clone https://github.com/username/stockflow-api.git
cd stockflow-api
```

2. Install semua dependensi
```bash
npm install
```

3. Import database ke MySQL
```bash
mysql -u root -p < stockflow-terbaru.sql
```

## Konfigurasi

1. Buat file `.env` pada folder root dengan isi:
```
PORT=5000
JWT_SECRET=rahasia_jwt_anda
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_database_anda
DB_NAME=stockflow-terbaru
```

2. Jalankan aplikasi
```bash
node server.js
```

## API Endpoints

Base URL: `http://localhost:5000/api`

### Autentikasi

#### Register User Baru

```http
POST /auth/register
Content-Type: application/json

{
  "nama": "Admin Toko",
  "nama_lengkap": "Admin Toko Daster Maura",
  "username": "admin",
  "email": "admin@dastermaura.com",
  "password": "password123",
  "role": "admin"
}

Response:
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "nama": "Admin Toko",
    "nama_lengkap": "Admin Toko Daster Maura",
    "username": "admin",
    "email": "admin@dastermaura.com",
    "role": "admin"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@dastermaura.com",
  "password": "password123"
}

Response:
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nama": "Admin Toko",
    "nama_lengkap": "Admin Toko Daster Maura",
    "username": "admin",
    "email": "admin@dastermaura.com",
    "role": "admin",
    "foto_profil": "http://localhost:5000/uploads/profile/profile_1.jpg"
  }
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>

Response:
{
  "message": "Logout berhasil"
}
```

### Barang

#### Mendapatkan Semua Barang

```http
GET /barang
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id_barang": 1,
      "nama_barang": "Daster Maura",
      "kategori": "Daster",
      "harga": "100000.00",
      "stok": 50,
      "foto": "foto-1749078865134-244751454.png"
    },
    {
      "id_barang": 2,
      "nama_barang": "Gamis Hitam",
      "kategori": "Gamis",
      "harga": "100000.00",
      "stok": 30,
      "foto": "foto-1749103504885-497885875.jpg"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Mendapatkan Detail Barang

```http
GET /barang/:id_barang
Authorization: Bearer <token>

Response:
{
  "data": {
    "id_barang": 1,
    "nama_barang": "Daster Maura",
    "kategori": "Daster", 
    "harga": "100000.00",
    "stok": 50,
    "foto": "foto-1749078865134-244751454.png"
  }
}
```

#### Menambah Barang Baru

```http
POST /barang
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- nama_barang: "Daster Maura"
- kategori: "Daster"
- harga: 100000
- stok: 0
- foto: [file gambar]

Response:
{
  "message": "Barang berhasil ditambahkan",
  "data": {
    "id_barang": 1,
    "nama_barang": "Daster Maura",
    "kategori": "Daster",
    "harga": "100000.00",
    "stok": 0,
    "foto": "foto-1749078865134-244751454.png"
  }
}
```

#### Mengupdate Barang

```http
PUT /barang/:id_barang
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- nama_barang: "Daster Maura Premium"
- kategori: "Daster"
- harga: 120000
- stok: 50
- foto: [file gambar] (opsional)

Response:
{
  "message": "Barang berhasil diupdate",
  "data": {
    "id_barang": 1,
    "nama_barang": "Daster Maura Premium",
    "kategori": "Daster",
    "harga": "120000.00",
    "stok": 50,
    "foto": "foto-1749449187740-312989145.png"
  }
}
```

#### Menghapus Barang

```http
DELETE /barang/:id_barang
Authorization: Bearer <token>

Response:
{
  "message": "Barang berhasil dihapus"
}
```

### Barang Masuk

#### Mendapatkan Semua Data Barang Masuk

```http
GET /barang-masuk
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id_bm": 1,
      "id_barang": 1,
      "jumlah": 50,
      "tanggal": "2023-06-10T08:30:00.000Z",
      "Barang": {
        "nama_barang": "Daster Maura"
      }
    },
    {
      "id_bm": 2,
      "id_barang": 2,
      "jumlah": 30,
      "tanggal": "2023-06-10T09:15:00.000Z",
      "Barang": {
        "nama_barang": "Gamis Hitam"
      }
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Menambah Data Barang Masuk

```http
POST /barang-masuk
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_barang": 1,
  "jumlah": 50
}

Response:
{
  "message": "Barang masuk berhasil dicatat",
  "data": {
    "id_bm": 1,
    "id_barang": 1,
    "jumlah": 50,
    "tanggal": "2023-06-12T10:30:25.000Z"
  }
}
```

### Barang Keluar

#### Mendapatkan Semua Data Barang Keluar

```http
GET /barang-keluar
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id_bk": 1,
      "id_barang": 1,
      "jumlah": 10,
      "jumlah_harga": "1000000.00",
      "tanggal": "2023-06-11T13:45:00.000Z",
      "Barang": {
        "nama_barang": "Daster Maura",
        "harga": "100000.00"
      }
    },
    {
      "id_bk": 2,
      "id_barang": 2,
      "jumlah": 5,
      "jumlah_harga": "500000.00",
      "tanggal": "2023-06-11T14:20:00.000Z",
      "Barang": {
        "nama_barang": "Gamis Hitam",
        "harga": "100000.00"
      }
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Menambah Data Barang Keluar

```http
POST /barang-keluar
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_barang": 1,
  "jumlah": 10
}

Response:
{
  "message": "Barang keluar berhasil dicatat",
  "data": {
    "id_bk": 1,
    "id_barang": 1,
    "jumlah": 10,
    "jumlah_harga": "1000000.00",
    "tanggal": "2023-06-12T11:15:30.000Z"
  }
}
```

### Dashboard

#### Mendapatkan Data Ringkasan

```http
GET /dashboard/summary
Authorization: Bearer <token>

Response:
{
  "data": {
    "totalBarang": 2,
    "totalStok": 65,
    "totalMasukHariIni": 0,
    "totalKeluarHariIni": 0,
    "totalNilai": 6500000
  }
}
```

#### Mendapatkan Data Chart Barang Per Kategori

```http
GET /dashboard/chart/barang
Authorization: Bearer <token>

Response:
{
  "data": {
    "labels": ["Daster", "Gamis"],
    "datasets": [{
      "label": "Jumlah Barang per Kategori",
      "data": [1, 1],
      "backgroundColor": [
        "#FF6384",
        "#36A2EB"
      ]
    }]
  }
}
```

#### Mendapatkan Data Chart Barang Masuk

```http
GET /dashboard/chart/barang-masuk?startDate=2023-06-01&endDate=2023-06-12
Authorization: Bearer <token>

Response:
{
  "data": {
    "labels": ["2023-06-10"],
    "datasets": [{
      "label": "Jumlah Barang Masuk per Hari",
      "data": [80],
      "fill": false,
      "borderColor": "#36A2EB",
      "tension": 0.1
    }]
  }
}
```

#### Mendapatkan Data Chart Barang Keluar

```http
GET /dashboard/chart/barang-keluar?startDate=2023-06-01&endDate=2023-06-12
Authorization: Bearer <token>

Response:
{
  "data": {
    "labels": ["2023-06-11"],
    "datasets": [{
      "label": "Jumlah Barang Keluar per Hari",
      "data": [15],
      "fill": false,
      "borderColor": "#FF6384",
      "tension": 0.1
    }]
  }
}
```

### Profil

#### Mendapatkan Profil

```http
GET /profile
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "nama": "Admin Toko",
  "nama_lengkap": "Admin Toko Daster Maura",
  "username": "admin",
  "email": "admin@dastermaura.com",
  "foto_profil": "http://localhost:5000/uploads/profile/profile_1.jpg",
  "role": "admin",
  "created_at": "2023-06-01T08:00:00.000Z"
}
```

#### Mengupdate Profil

```http
PUT /profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- nama: "Admin Toko Update"
- nama_lengkap: "Admin Toko Daster Maura Update"
- username: "admin"
- email: "admin@dastermaura.com"
- foto: [file foto] (opsional)

Response:
{
  "message": "Profil berhasil diperbarui",
  "user": {
    "id": 1,
    "nama": "Admin Toko Update",
    "nama_lengkap": "Admin Toko Daster Maura Update",
    "username": "admin",
    "email": "admin@dastermaura.com",
    "foto_profil": "http://localhost:5000/uploads/profile/profile_1.jpg",
    "role": "admin"
  }
}
```

## Panduan Pengujian di Postman

### Langkah 1: Setup Environment

1. Buka Postman
2. Klik tombol "New" dan pilih "Environment"
3. Beri nama "StockFlow API"
4. Tambahkan variabel:
   - `base_url` dengan value `http://localhost:5000/api`
   - `token` (biarkan kosong)
5. Klik "Save"

### Langkah 2: Import Collection

1. Klik tombol "Import" di Postman
2. Upload file collection atau masukkan link
3. Setelah import selesai, collection "StockFlow API" akan muncul

### Langkah 3: Autentikasi

1. Jalankan request "Login" dengan kredensial yang valid
2. Setelah login berhasil, salin token dari response
3. Simpan token di variabel environment:
   - Klik "Environment quick look" (ikon mata)
   - Edit variabel "token" dengan nilai token yang telah disalin
   - Klik "Save"

### Langkah 4: Menggunakan API

Semua request yang memerlukan autentikasi akan menggunakan token dari environment variabel. 
Untuk mengirim request dengan token:

1. Pilih request yang ingin dijalankan
2. Pada tab "Authorization", pilih Type "Bearer Token"
3. Pada field Token, masukkan `{{token}}`
4. Klik "Send"

## Contoh Penggunaan

### Skenario: Mengelola Stok Daster Maura

#### 1. Login Sebagai Admin
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@dastermaura.com",
  "password": "password123"
}
```

#### 2. Tambah Produk Baru
```http
POST /barang
Authorization: Bearer <token>
Content-Type: multipart/form-data

- nama_barang: "Daster Maura"
- kategori: "Daster"
- harga: 100000
- stok: 0
- foto: [file gambar]
```

#### 3. Tambah Stok Barang (Barang Masuk)
```http
POST /barang-masuk
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_barang": 1,
  "jumlah": 50
}
```

#### 4. Catat Penjualan (Barang Keluar)
```http
POST /barang-keluar
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_barang": 1,
  "jumlah": 10
}
```

#### 5. Lihat Laporan Dashboard
```http
GET /dashboard/summary
Authorization: Bearer <token>
```

```http
GET /dashboard/chart/barang-keluar?startDate=2023-06-01&endDate=2023-06-12
Authorization: Bearer <token>
```

---

## Catatan Penting

- API ini menggunakan token JWT yang berlaku selama 8 jam
- Format tanggal yang digunakan adalah ISO 8601 (YYYY-MM-DD)
- Semua endpoint protected memerlukan token yang valid di header Authorization
- Pastikan folder `uploads` memiliki izin tulis untuk penyimpanan foto

Jika ada pertanyaan atau kendala dalam penggunaan API, silakan hubungi admin@dastermaura.com
