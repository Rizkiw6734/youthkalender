const db = require("../config/db");

module.exports = {

    // Halaman daftar bulan
    index: async (req, res) => {
        try {
            const [bulan] = await db.query("SELECT * FROM bulan ORDER BY id ASC");
            res.render("admin/bulan/index", {
                layout: "layouts/admin",
                title: "Daftar Bulan",
                bulan
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Terjadi kesalahan di server");
        }
    },

    // Halaman tambah bulan
    create: (req, res) => {
        res.render("admin/bulan/create", {
            layout: "layouts/admin",
            title: "Tambah Bulan"
        });
    },

    // Simpan bulan baru
    store: async (req, res) => {
        const { nama_bulan, deskripsi } = req.body;
        try {
            await db.query(
                "INSERT INTO bulan (nama_bulan, deskripsi) VALUES (?, ?)",
                [nama_bulan, deskripsi]
            );
            res.redirect("/admin/bulan");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Gagal menambahkan bulan");
        }
    },

    // Halaman edit bulan
    edit: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await db.query("SELECT * FROM bulan WHERE id = ?", [id]);
            if (rows.length === 0) return res.status(404).send("Bulan tidak ditemukan");
            res.render("admin/bulan/edit", {
                layout: "layouts/admin",
                title: "Edit Bulan",
                bulan: rows[0]
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Terjadi kesalahan di server");
        }
    },

    // Update bulan
    update: async (req, res) => {
        const { id } = req.params;
        const { nama_bulan, deskripsi } = req.body;
        try {
            await db.query(
                "UPDATE bulan SET nama_bulan = ?, deskripsi = ? WHERE id = ?",
                [nama_bulan, deskripsi, id]
            );
            res.redirect("/admin/bulan");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Gagal memperbarui bulan");
        }
    },

    // Hapus bulan
    destroy: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query("DELETE FROM bulan WHERE id = ?", [id]);
            res.redirect("/admin/bulan");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Gagal menghapus bulan");
        }
    }

};
