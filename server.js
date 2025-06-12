const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Membuat instance app terlebih dahulu
const app = express();

// Menyajikan file dari folder 'uploads' sebagai file statis
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
const barangRoutes = require("./routes/barang");
const barangMasukRoutes = require("./routes/barangMasuk");
const barangKeluarRoutes = require("./routes/barangKeluar");
const authMiddleware = require("./middlewares/authMiddleware");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/barang-masuk", barangMasukRoutes);
app.use("/api/barang-keluar", barangKeluarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

app.use("/uploads", express.static("public/uploads"));
