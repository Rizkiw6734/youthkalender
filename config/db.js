// config/db.js
const mysql = require("mysql2");

// Tentukan config connection
const connectionConfig = process.env.YOUTH_DB
  ? { uri: process.env.YOUTH_DB, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }
  : { host: "localhost", user: "root", password: "", database: "youthmedia", waitForConnections: true, connectionLimit: 10, queueLimit: 0 };

// Gunakan pool agar aman di serverless environment (Vercel)
const pool = mysql.createPool(connectionConfig);

// Gunakan promise agar lebih mudah pakai async/await
const db = pool.promise();

// Tes koneksi
db.getConnection()
  .then(() => console.log("Database tersambung!"))
  .catch(err => console.log("Gagal koneksi:", err.message));

module.exports = db;
