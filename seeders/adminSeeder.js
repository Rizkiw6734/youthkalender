const bcrypt = require("bcryptjs");
const db = require("../config/db");

async function seedAdmin() {
    const username = "admin";
    const passwordPlain = "123456";

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const sql = "INSERT INTO admins (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.log("Seeder gagal:", err);
        } else {
            console.log("Admin berhasil dibuat!");
        }
        process.exit();
    });
}

seedAdmin();
