const db = require("../database");

exports.getBarangMasuk = async (req, res) => {
  try {
    let query = `
      SELECT bm.id_bm, b.nama_barang, bm.jumlah, bm.tanggal 
      FROM barang_masuk bm 
      JOIN barang b ON bm.id_barang = b.id_barang
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
  const { id_barang, jumlah, tanggal } = req.body;
  try {
    await db.query(
      "INSERT INTO barang_masuk (id_barang, jumlah, tanggal) VALUES (?, ?, ?)",
      [id_barang, jumlah, tanggal]
    );

    // Update stok di tabel barang
    await db.query("UPDATE barang SET stok = stok + ? WHERE id_barang = ?", [
      jumlah,
      id_barang,
    ]);

    res.status(201).json({ message: "Barang masuk berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBarangMasuk = async (req, res) => {
  const { id_bm } = req.params;
  const { id_barang, jumlah } = req.body;
  try {
    // Dapatkan jumlah lama sebelum update
    const [[oldData]] = await db.query(
      "SELECT jumlah FROM barang_masuk WHERE id_bm = ?",
      [id_bm]
    );

    // Hitung selisih jumlah untuk update stok
    const selisih = jumlah - oldData.jumlah;

    await db.query(
      "UPDATE barang_masuk SET id_barang = ?, jumlah = ? WHERE id_bm = ?",
      [id_barang, jumlah, id_bm]
    );

    // Update stok barang
    await db.query("UPDATE barang SET stok = stok + ? WHERE id_barang = ?", [
      selisih,
      id_barang,
    ]);

    res.json({ message: "Barang masuk berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBarangMasuk = async (req, res) => {
  const { id_bm } = req.params;
  try {
    // Ambil data sebelum dihapus
    const [[data]] = await db.query(
      "SELECT id_barang, jumlah FROM barang_masuk WHERE id_bm = ?",
      [id_bm]
    );

    // Hapus data barang masuk
    await db.query("DELETE FROM barang_masuk WHERE id_bm = ?", [id_bm]);

    // Kurangi stok barang
    await db.query("UPDATE barang SET stok = stok - ? WHERE id_barang = ?", [
      data.jumlah,
      data.id_barang,
    ]);

    res.json({ message: "Barang masuk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
