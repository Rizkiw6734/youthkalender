const db = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {

    // halaman login
    loginPage: (req, res) => {
        res.render("admin/login", {
            layout: "layouts/admin",
            title: "Login Admin",
            error: null
        });
    },

    // proses login
    loginProcess: (req, res) => {
        const { username, password } = req.body; // ⬅️ password harus diambil dari body

        // cek admin di database
        db.query("SELECT * FROM admins WHERE username = ?", [username], async (err, results) => {
            if (err) throw err;

            // username tidak ditemukan
            if (results.length === 0) {
                return res.render("admin/login", {
                    layout: "layouts/admin",
                    title: "Login Admin",
                    error: "Username tidak ditemukan!"
                });
            }

            const admin = results[0];

            // cek kecocokan password
            const validPassword = await bcrypt.compare(password, admin.password);

            if (!validPassword) {
                return res.render("admin/login", {
                    layout: "layouts/admin",
                    title: "Login Admin",
                    error: "Password salah!"
                });
            }

            // simpan session (sesuaikan dengan kolom tabel)
            req.session.admin = {
                id: admin.id,
                username: admin.username
            };

            res.redirect("/admin/dashboard");
        });
    },

    // halaman dashboard admin
    dashboard: (req, res) => {
        res.render("admin/dashboard", {
            layout: "layouts/admin",
            title: "Dashboard Admin",
            admin: req.session.admin
        });
    },

    // logout
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/admin/login");
        });
    }
};
