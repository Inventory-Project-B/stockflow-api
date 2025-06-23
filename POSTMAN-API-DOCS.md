# StockFlow API - Dokumentasi Postman

Dokumentasi ini menyediakan informasi tentang endpoint API StockFlow beserta contoh request dan response untuk pengujian di Postman.

## Daftar Isi

- [Autentikasi](#autentikasi)
  - [Login](#login)
  - [Register](#register)
- [Manajemen Barang](#manajemen-barang)
  - [Mendapatkan Semua Barang](#mendapatkan-semua-barang)
  - [Mendapatkan Detail Barang](#mendapatkan-detail-barang)
  - [Membuat Barang Baru](#membuat-barang-baru)
  - [Mengupdate Barang](#mengupdate-barang)
  - [Menghapus Barang](#menghapus-barang)
- [Barang Masuk](#barang-masuk)
  - [Mendapatkan Semua Barang Masuk](#mendapatkan-semua-barang-masuk)
  - [Membuat Barang Masuk Baru](#membuat-barang-masuk-baru)
  - [Mengupdate Barang Masuk](#mengupdate-barang-masuk)
  - [Menghapus Barang Masuk](#menghapus-barang-masuk)
- [Barang Keluar](#barang-keluar)
  - [Mendapatkan Semua Barang Keluar](#mendapatkan-semua-barang-keluar)
  - [Membuat Barang Keluar Baru](#membuat-barang-keluar-baru)
  - [Mengupdate Barang Keluar](#mengupdate-barang-keluar)
  - [Menghapus Barang Keluar](#menghapus-barang-keluar)
- [Dashboard](#dashboard)
  - [Ringkasan Dashboard](#ringkasan-dashboard)
  - [Grafik Barang per Kategori](#grafik-barang-per-kategori)
  - [Grafik Barang Masuk](#grafik-barang-masuk)
  - [Grafik Barang Keluar](#grafik-barang-keluar)

## Cara Penggunaan

1. Import collection ke Postman (file dapat diexport dari dokumentasi ini)
2. Lakukan login terlebih dahulu untuk mendapatkan token
3. Token akan otomatis disimpan sebagai variabel environment untuk request selanjutnya

## Autentikasi

### Login

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Request Body:**

```json
{
  "username": "kelompok2",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nama": "kelompok2",
    "username": "kelompok2",
    "email": "kelompok2@mail.com",
    "role": "admin"
  }
}
```

### Register

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Request Body:**

```json
{
  "nama": "User Baru",
  "nama_lengkap": "User Baru Lengkap",
  "username": "userbaru",
  "email": "user.baru@mail.com",
  "password": "password123",
  "role": "pegawai"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User berhasil didaftarkan"
}
```

## Manajemen Barang

### Mendapatkan Semua Barang

**Endpoint:** `GET http://localhost:5000/api/barang`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode": "BRG001",
      "nama_barang": "Daster",
      "kategori": "Pakaian",
      "harga": 50000,
      "stok": 100,
      "deskripsi": "Daster wanita",
      "foto": "uploads/foto-1234567890.jpg"
    },
    {
      "id": 2,
      "kode": "BRG002",
      "nama_barang": "Mukena",
      "kategori": "Pakaian",
      "harga": 150000,
      "stok": 50,
      "deskripsi": "Mukena dewasa",
      "foto": "uploads/foto-0987654321.jpg"
    }
  ]
}
```

### Mendapatkan Detail Barang

**Endpoint:** `GET http://localhost:5000/api/barang/{id}`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "kode": "BRG001",
    "nama_barang": "Daster",
    "kategori": "Pakaian",
    "harga": 50000,
    "stok": 100,
    "deskripsi": "Daster wanita",
    "foto": "uploads/foto-1234567890.jpg"
  }
}
```

### Membuat Barang Baru

**Endpoint:** `POST http://localhost:5000/api/barang`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: multipart/form-data

**Form Data:**

- kode: BRG003
- nama_barang: Gamis
- kategori: Pakaian
- harga: 200000
- stok: 30
- deskripsi: Gamis syari
- foto: [file gambar]

**Response:**

```json
{
  "success": true,
  "message": "Barang berhasil ditambahkan",
  "data": {
    "id": 3,
    "kode": "BRG003",
    "nama_barang": "Gamis",
    "kategori": "Pakaian",
    "harga": 200000,
    "stok": 30,
    "deskripsi": "Gamis syari",
    "foto": "uploads/foto-1234567890.jpg"
  }
}
```

### Mengupdate Barang

**Endpoint:** `PUT http://localhost:5000/api/barang/{id}`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: multipart/form-data

**Form Data:**

- kode: BRG003
- nama_barang: Gamis Dewasa
- kategori: Pakaian
- harga: 225000
- stok: 30
- deskripsi: Gamis syari dewasa
- foto: [file gambar] (opsional)

**Response:**

```json
{
  "success": true,
  "message": "Barang berhasil diupdate",
  "data": {
    "id": 3,
    "kode": "BRG003",
    "nama_barang": "Gamis Dewasa",
    "kategori": "Pakaian",
    "harga": 225000,
    "stok": 30,
    "deskripsi": "Gamis syari dewasa",
    "foto": "uploads/foto-1234567890.jpg"
  }
}
```

### Menghapus Barang

**Endpoint:** `DELETE http://localhost:5000/api/barang/{id}`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Barang berhasil dihapus"
}
```

## Barang Masuk

### Mendapatkan Semua Barang Masuk

**Endpoint:** `GET http://localhost:5000/api/barang-masuk`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode_transaksi": "BM001",
      "id_barang": 1,
      "nama_barang": "Daster",
      "jumlah": 20,
      "tanggal": "2025-06-20T00:00:00.000Z",
      "keterangan": "Pengiriman dari supplier"
    },
    {
      "id": 2,
      "kode_transaksi": "BM002",
      "id_barang": 2,
      "nama_barang": "Mukena",
      "jumlah": 15,
      "tanggal": "2025-06-21T00:00:00.000Z",
      "keterangan": "Pengiriman dari supplier"
    }
  ]
}
```

### Membuat Barang Masuk Baru

**Endpoint:** `POST http://localhost:5000/api/barang-masuk`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: application/json

**Request Body:**

```json
{
  "barang_id": 3,
  "jumlah": 10,
  "tanggal": "2025-06-22"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Barang masuk berhasil ditambahkan",
  "data": {
    "id": 3,
    "barang_id": 3,
    "jumlah": 10,
    "tanggal": "2025-06-22T00:00:00.000Z"
  }
}
```

### Mengupdate Barang Masuk

**Endpoint:** `PUT http://localhost:5000/api/barang-masuk/1`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: application/json

**Request Body:**

```json
{
  "barang_id": 3,
  "jumlah": 15,
  "tanggal": "2025-06-22"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Barang masuk berhasil diperbarui"
}
```

### Menghapus Barang Masuk

**Endpoint:** `DELETE http://localhost:5000/api/barang-masuk/1`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Barang masuk berhasil dihapus"
}
```

## Barang Keluar

### Mendapatkan Semua Barang Keluar

**Endpoint:** `GET http://localhost:5000/api/barang-keluar`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode_transaksi": "BK001",
      "id_barang": 1,
      "nama_barang": "Daster",
      "jumlah": 5,
      "tanggal": "2025-06-20T00:00:00.000Z",
      "keterangan": "Pengiriman ke toko A"
    },
    {
      "id": 2,
      "kode_transaksi": "BK002",
      "id_barang": 2,
      "nama_barang": "Mukena",
      "jumlah": 3,
      "tanggal": "2025-06-21T00:00:00.000Z",
      "keterangan": "Pengiriman ke toko B"
    }
  ]
}
```

### Membuat Barang Keluar Baru

**Endpoint:** `POST http://localhost:5000/api/barang-keluar`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: application/json

**Request Body:**

```json
{
  "barang_id": 3,
  "jumlah": 2,
  "tanggal": "2025-06-22"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Barang keluar berhasil ditambahkan",
  "data": {
    "id": 3,
    "barang_id": 3,
    "jumlah": 2,
    "tanggal": "2025-06-22T00:00:00.000Z"
  }
}
```

### Mengupdate Barang Keluar

**Endpoint:** `PUT http://localhost:5000/api/barang-keluar/1`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: application/json

**Request Body:**

```json
{
  "barang_id": 3,
  "jumlah": 3,
  "tanggal": "2025-06-22"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Barang keluar berhasil diperbarui"
}
```

### Menghapus Barang Keluar

**Endpoint:** `DELETE http://localhost:5000/api/barang-keluar/1`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Barang keluar berhasil dihapus"
}
```

## Dashboard

### Ringkasan Dashboard

**Endpoint:** `GET http://localhost:5000/api/dashboard/summary`

**Headers:**

- Authorization: Bearer {token}

**Response:**

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

### Grafik Barang per Kategori

**Endpoint:** `GET http://localhost:5000/api/dashboard/chart/barang`

**Headers:**

- Authorization: Bearer {token}

**Response:**

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

### Grafik Barang Masuk

**Endpoint:** `GET http://localhost:5000/api/dashboard/chart/barang-masuk`

**Headers:**

- Authorization: Bearer {token}

**Query Parameters (opsional):**

- startDate: 2025-01-01
- endDate: 2025-12-31

**Response:**

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

### Grafik Barang Keluar

**Endpoint:** `GET http://localhost:5000/api/dashboard/chart/barang-keluar`

**Headers:**

- Authorization: Bearer {token}

**Query Parameters (opsional):**

- startDate: 2025-01-01
- endDate: 2025-12-31

**Response:**

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

## Menggunakan Postman Tests

Untuk mempermudah pengujian API, Anda dapat menambahkan script test berikut pada tab "Tests" di Postman untuk login dan menyimpan token secara otomatis:

```javascript
// Menyimpan token dari response login
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  if (jsonData.token) {
    pm.environment.set("authToken", jsonData.token);
    console.log("Token saved to environment");
  }
}

// Validasi response
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has success flag", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.success).to.eql(true);
});
```

## Import Collection

Anda dapat mengimport collection ini ke Postman dengan cara:

1. Unduh file collection JSON (tersedia terpisah)
2. Buka Postman
3. Klik "Import" di pojok kiri atas
4. Pilih file collection JSON
5. Klik "Import"

Setelah mengimpor collection, Anda dapat mulai menguji API StockFlow dengan mudah.
