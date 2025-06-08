const db = require("../database");
const upload = require("../config/multer");

exports.getBarang = async (req, res) => {
  try {
    const [barang] = await db.query("SELECT * FROM barang");
    // Tambahkan path lengkap untuk foto jika perlu
    const barangWithFotoUrl = barang.map((item) => ({
      ...item,
      foto: item.foto
        ? `${req.protocol}://${req.get("host")}/uploads/${item.foto}`
        : null,
    }));
    res.json(barangWithFotoUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware untuk handle upload
exports.uploadFoto = upload.single("foto");

exports.addBarang = async (req, res) => {
  const { nama_barang, kategori, stok, harga } = req.body;

  try {
    const foto = req.file ? req.file.filename : null;

    await db.query(
      "INSERT INTO barang (nama_barang, kategori, stok, harga, foto) VALUES (?, ?, ?, ?, ?)",
      [nama_barang, kategori || null, stok || 0, harga || 0, foto]
    );

    res.status(201).json({
      message: "Barang berhasil ditambahkan",
      data: {
        nama_barang,
        kategori,
        stok,
        harga,
        foto,
      },
    });
  } catch (err) {
    // Hapus file yang sudah diupload jika terjadi error
    if (req.file) {
      const fs = require("fs");
      fs.unlinkSync(`public/uploads/${req.file.filename}`);
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getBarangById = async (req, res) => {
  const { id_barang } = req.params;
  try {
    const [[barang]] = await db.query(
      "SELECT * FROM barang WHERE id_barang = ?",
      [id_barang]
    );

    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // Tambahkan path lengkap untuk foto jika perlu
    if (barang.foto) {
      barang.foto = `${req.protocol}://${req.get("host")}/uploads/${barang.foto}`;
    }

    res.json(barang);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBarang = async (req, res) => {
  const { id_barang } = req.params;
  const { nama_barang, kategori, stok, harga } = req.body;
  try {
    // Cek apakah barang ada
    const [[barang]] = await db.query(
      "SELECT * FROM barang WHERE id_barang = ?",
      [id_barang]
    );

    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // Handle jika ada upload foto baru
    let foto = barang.foto;
    if (req.file) {
      foto = req.file.filename;
      // Hapus foto lama jika ada
      if (barang.foto) {
        const fs = require("fs");
        const path = require("path");
        const oldPath = path.join(__dirname, "../../public/uploads", barang.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await db.query(
      "UPDATE barang SET nama_barang = ?, kategori = ?, stok = ?, harga = ?, foto = ? WHERE id_barang = ?",
      [
        nama_barang || barang.nama_barang,
        kategori !== undefined ? kategori : barang.kategori,
        stok !== undefined ? stok : barang.stok,
        harga !== undefined ? harga : barang.harga,
        foto,
        id_barang,
      ]
    );

    res.json({
      message: "Barang berhasil diperbarui",
      data: {
        id_barang,
        nama_barang: nama_barang || barang.nama_barang,
        kategori: kategori !== undefined ? kategori : barang.kategori,
        stok: stok !== undefined ? stok : barang.stok,
        harga: harga !== undefined ? harga : barang.harga,
        foto,
      },
    });
  } catch (err) {
    // Hapus file yang sudah diupload jika terjadi error
    if (req.file) {
      const fs = require("fs");
      fs.unlinkSync(`public/uploads/${req.file.filename}`);
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBarang = async (req, res) => {
  const { id_barang } = req.params;
  try {
    // Cek apakah barang ada
    const [[barang]] = await db.query(
      "SELECT * FROM barang WHERE id_barang = ?",
      [id_barang]
    );

    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // Cek apakah barang pernah dipakai di transaksi
    const [[checkMasuk]] = await db.query(
      "SELECT COUNT(*) as count FROM barang_masuk WHERE id_barang = ?",
      [id_barang]
    );

    const [[checkKeluar]] = await db.query(
      "SELECT COUNT(*) as count FROM barang_keluar WHERE id_barang = ?",
      [id_barang]
    );

    if (checkMasuk.count > 0 || checkKeluar.count > 0) {
      return res
        .status(400)
        .json({ message: "Barang tidak dapat dihapus karena sudah ada transaksi" });
    }

    // Hapus barang
    await db.query("DELETE FROM barang WHERE id_barang = ?", [id_barang]);

    // Hapus foto jika ada
    if (barang.foto) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../../public/uploads", barang.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
