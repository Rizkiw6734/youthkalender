const mysql = require("mysql2");

// Gunakan URL langsung dari Railway
const db = mysql.createConnection(
  "mysql://root:ypnYOuiNOgLNTbDOPxQsqbZgnMyFBVYq@metro.proxy.rlwy.net:20493/railway"
);

db.connect((err) => {
  if (err) {
    console.log("Gagal koneksi ke Railway:", err.message);
  } else {
    console.log("Database Railway tersambung!");
  }
});

module.exports = db;
