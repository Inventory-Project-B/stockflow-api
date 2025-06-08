const db = require("../database");

exports.getBarang = async (req, res) => {
  try {
    const [barang] = await db.query("SELECT * FROM barang");
    res.json(barang);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBarang = async (req, res) => {
  const { nama_barang, stok, harga } = req.body;
  try {
    await db.query(
      "INSERT INTO barang (nama_barang, stok, harga) VALUES (?, ?, ?)",
      [nama_barang, stok || 0, harga || 0]
    );
    res.status(201).json({ message: "Barang berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBarang = async (req, res) => {
  const { id } = req.params;
  const { nama_barang, stok, harga } = req.body;
  try {
    await db.query(
      "UPDATE barang SET nama_barang = ?, stok = ?, harga = ? WHERE id = ?",
      [nama_barang, stok, harga, id]
    );
    res.json({ message: "Barang berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBarang = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM barang WHERE id = ?", [id]);
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
