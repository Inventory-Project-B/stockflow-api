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

exports.updateBarang = async (req, res) => {
  const { id } = req.params;
  const { nama_barang, kategori, stok, harga } = req.body;

  try {
    // Cari barang lama untuk menghapus foto lama jika ada
    const [oldBarang] = await db.query("SELECT foto FROM barang WHERE id = ?", [
      id,
    ]);
    const oldFoto = oldBarang[0]?.foto;

    const foto = req.file ? req.file.filename : oldFoto;

    await db.query(
      "UPDATE barang SET nama_barang = ?, kategori = ?, stok = ?, harga = ?, foto = ? WHERE id = ?",
      [nama_barang, kategori, stok, harga, foto, id]
    );

    // Hapus foto lama jika ada file baru yang diupload
    if (req.file && oldFoto) {
      const fs = require("fs");
      fs.unlinkSync(`public/uploads/${oldFoto}`);
    }

    res.json({
      message: "Barang berhasil diperbarui",
      data: {
        id,
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

exports.deleteBarang = async (req, res) => {
  const { id } = req.params;
  try {
    // Cari foto sebelum menghapus data
    const [barang] = await db.query("SELECT foto FROM barang WHERE id = ?", [
      id,
    ]);
    const foto = barang[0]?.foto;

    await db.query("DELETE FROM barang WHERE id = ?", [id]);

    // Hapus file foto jika ada
    if (foto) {
      const fs = require("fs");
      fs.unlinkSync(`public/uploads/${foto}`);
    }

    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
