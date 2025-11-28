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
    loginProcess: async (req, res) => {
        const { username, password } = req.body;

        try {
            // pakai pool dengan promise
            const [results] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);

            if (results.length === 0) {
                return res.render("admin/login", {
                    layout: "layouts/admin",
                    title: "Login Admin",
                    error: "Username tidak ditemukan!"
                });
            }

            const admin = results[0];

            const validPassword = await bcrypt.compare(password, admin.password);

            if (!validPassword) {
                return res.render("admin/login", {
                    layout: "layouts/admin",
                    title: "Login Admin",
                    error: "Password salah!"
                });
            }

            // simpan session
            req.session.admin = {
                id: admin.id,
                username: admin.username
            };

            res.redirect("/admin/dashboard");

        } catch (err) {
            console.log(err);
            res.render("admin/login", {
                layout: "layouts/admin",
                title: "Login Admin",
                error: "Terjadi kesalahan server"
            });
        }
    },

    // halaman dashboard
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
