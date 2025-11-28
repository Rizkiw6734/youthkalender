const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const authAdmin = require("../middlewares/authAdmin");

// login form
router.get("/login", adminAuthController.loginPage);

// proses login
router.post("/login", adminAuthController.loginProcess);

// dashboard
router.get("/dashboard", authAdmin, adminAuthController.dashboard);

// logout
router.get("/logout", adminAuthController.logout);

module.exports = router;
