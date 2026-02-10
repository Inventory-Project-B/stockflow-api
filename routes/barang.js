// const express = require("express");
// const {
//   getBarang,
//   addBarang,
//   updateBarang,
//   deleteBarang,
// } = require("../controllers/barangController");
// const authMiddleware = require("../middlewares/authMiddleware");
// const router = express.Router();

// router.get("/", authMiddleware, getBarang);
// router.post("/", authMiddleware, addBarang);
// router.put("/:id", authMiddleware, updateBarang);
// router.delete("/:id", authMiddleware, deleteBarang);

// module.exports = router;

const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");

router.get("/", barangController.getBarang);
router.post(
  "/",
  barangController.uploadFoto, // Middleware upload
  barangController.addBarang
);
router.put(
  "/:id",
  barangController.uploadFoto, // Middleware upload
  barangController.updateBarang
);
router.delete("/:id", barangController.deleteBarang);

module.exports = router;
