const db = require("../database");

exports.getBarangKeluar = async (req, res) => {
  try {
    // let query = `
    //   SELECT bk.id, b.nama_barang, bk.jumlah, bk.tanggal
    //   FROM barang_keluar bk
    //   JOIN barang b ON bk.barang_id = b.id
    // `;

    let query = `
      SELECT bk.id, b.nama_barang, b.harga, bk.jumlah, bk.tanggal
      FROM barang_keluar bk
      JOIN barang b ON bk.barang_id = b.id
    `;

    const params = [];

    // Handle filter tanggal
    if (req.query.start && req.query.end) {
      query += " WHERE bk.tanggal BETWEEN ? AND ?";
      params.push(req.query.start, req.query.end);
    } else if (req.query.start) {
      query += " WHERE bk.tanggal >= ?";
      params.push(req.query.start);
    } else if (req.query.end) {
      query += " WHERE bk.tanggal <= ?";
      params.push(req.query.end);
    }

    query += " ORDER BY bk.tanggal DESC";

    const [barangKeluar] = await db.query(query, params);
    res.json(barangKeluar);
  } catch (err) {
    console.error("Error in getBarangKeluar:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.addBarangKeluar = async (req, res) => {
  const { barang_id, jumlah, tanggal } = req.body;
  try {
    await db.query(
      "INSERT INTO barang_keluar (barang_id, jumlah, tanggal) VALUES (?, ?, ?)",
      [barang_id, jumlah, tanggal]
    );

    // Update stok di tabel barang
    await db.query("UPDATE barang SET stok = stok - ? WHERE id = ?", [
      jumlah,
      barang_id,
    ]);

    res.status(201).json({ message: "Barang keluar berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBarangKeluar = async (req, res) => {
  const { id } = req.params;
  const { barang_id, jumlah } = req.body;
  try {
    // Dapatkan jumlah lama sebelum update
    const [[oldData]] = await db.query(
      "SELECT jumlah FROM barang_keluar WHERE id = ?",
      [id]
    );

    // Hitung selisih jumlah untuk update stok
    const selisih = jumlah - oldData.jumlah;

    // Periksa stok sebelum melakukan update
    if (selisih > 0) {
      const [[barang]] = await db.query(
        "SELECT stok FROM barang WHERE id = ?",
        [barang_id]
      );
      if (barang.stok < selisih) {
        return res
          .status(400)
          .json({ message: "Stok barang tidak mencukupi untuk perubahan ini" });
      }
    }

    await db.query(
      "UPDATE barang_keluar SET barang_id = ?, jumlah = ? WHERE id = ?",
      [barang_id, jumlah, id]
    );

    // Update stok barang
    await db.query("UPDATE barang SET stok = stok - ? WHERE id = ?", [
      selisih,
      barang_id,
    ]);

    res.json({ message: "Barang keluar berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBarangKeluar = async (req, res) => {
  const { id } = req.params;
  try {
    // Ambil data sebelum dihapus
    const [[data]] = await db.query(
      "SELECT barang_id, jumlah FROM barang_keluar WHERE id = ?",
      [id]
    );

    // Hapus data barang keluar
    await db.query("DELETE FROM barang_keluar WHERE id = ?", [id]);

    // Tambahkan kembali stok barang
    await db.query("UPDATE barang SET stok = stok + ? WHERE id = ?", [
      data.jumlah,
      data.barang_id,
    ]);

    res.json({ message: "Barang keluar berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
