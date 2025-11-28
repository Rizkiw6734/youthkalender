const express = require("express");
const router = express.Router();
const bulanController = require("../controllers/bulanController");

// Daftar bulan
router.get("/", bulanController.index);

// Tambah bulan
router.get("/create", bulanController.create);
router.post("/create", bulanController.store);

// Edit bulan
router.get("/edit/:id", bulanController.edit);
router.post("/edit/:id", bulanController.update);

// Hapus bulan
router.get("/delete/:id", bulanController.destroy);

module.exports = router;
