const db = require("../database");

exports.getBarangMasuk = async (req, res) => {
  try {
    let query = `
      SELECT bm.id, b.nama_barang, bm.jumlah, bm.tanggal 
      FROM barang_masuk bm 
      JOIN barang b ON bm.barang_id = b.id
    `;

    const params = [];

    if (req.query.start && req.query.end) {
      query += " WHERE bm.tanggal BETWEEN ? AND ?";
      params.push(req.query.start, req.query.end);
    } else if (req.query.start) {
      query += " WHERE bm.tanggal >= ?";
      params.push(req.query.start);
    } else if (req.query.end) {
      query += " WHERE bm.tanggal <= ?";
      params.push(req.query.end);
    }

    query += " ORDER BY bm.tanggal DESC";

    const [barangMasuk] = await db.query(query, params);
    res.json(barangMasuk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBarangMasuk = async (req, res) => {
  const { barang_id, jumlah, tanggal } = req.body;
  try {
    await db.query(
      "INSERT INTO barang_masuk (barang_id, jumlah, tanggal) VALUES (?, ?, ?)",
      [barang_id, jumlah, tanggal]
    );

    // Update stok di tabel barang
    await db.query("UPDATE barang SET stok = stok + ? WHERE id = ?", [
      jumlah,
      barang_id,
    ]);

    res.status(201).json({ message: "Barang masuk berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBarangMasuk = async (req, res) => {
  const { id } = req.params;
  const { barang_id, jumlah } = req.body;
  try {
    // Dapatkan jumlah lama sebelum update
    const [[oldData]] = await db.query(
      "SELECT jumlah FROM barang_masuk WHERE id = ?",
      [id]
    );

    // Hitung selisih jumlah untuk update stok
    const selisih = jumlah - oldData.jumlah;

    await db.query(
      "UPDATE barang_masuk SET barang_id = ?, jumlah = ? WHERE id = ?",
      [barang_id, jumlah, id]
    );

    // Update stok barang
    await db.query("UPDATE barang SET stok = stok + ? WHERE id = ?", [
      selisih,
      barang_id,
    ]);

    res.json({ message: "Barang masuk berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBarangMasuk = async (req, res) => {
  const { id } = req.params;
  try {
    // Ambil data sebelum dihapus
    const [[data]] = await db.query(
      "SELECT barang_id, jumlah FROM barang_masuk WHERE id = ?",
      [id]
    );

    // Hapus data barang masuk
    await db.query("DELETE FROM barang_masuk WHERE id = ?", [id]);

    // Kurangi stok barang
    await db.query("UPDATE barang SET stok = stok - ? WHERE id = ?", [
      data.jumlah,
      data.barang_id,
    ]);

    res.json({ message: "Barang masuk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
