const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

const app = express();

// Middleware body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// EJS + Layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// SESSION
app.use(
    session({
        secret: "secret-key-123",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2 // 2 jam session
        }
    })
);

// ❗ Session tersedia di EJS
app.use((req, res, next) => {
    res.locals.admin = req.session.admin || null;
    next();
});

// 🚫🔥 NON-AKTIFKAN CACHE (CEGAH BACK BUTTON SETELAH LOGOUT)
app.use((req, res, next) => {
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

// 🔥 Proteksi login
function requireLogin(req, res, next) {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    next();
}

function preventLoggedIn(req, res, next) {
    if (req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    next();
}

// ROUTES USER BIASA (PUBLIC)
app.get("/about", (req, res) => {
    res.render("about", { title: "Tentang Website" });
});

app.get("/piala", (req, res) => {
    res.render("piala", { title: "Piala Dunia" });
});

app.get("/bulan", (req, res) => {
    res.render("bulan", { title: "Bulan" });
});

// 🔥 Router admin
const adminRouter = require("./routes/adminRoutes");

// Halaman login → tidak boleh dibuka jika sudah login
app.use("/admin/login", preventLoggedIn);

// Lindungi semua route admin selain login & logout
app.use("/admin", (req, res, next) => {
    if (
        req.path === "/login" ||
        req.path === "/logout" ||
        req.path === "/process-login"
    ) {
        return next();
    }
    requireLogin(req, res, next);
});

app.use("/admin", adminRouter);

// DASHBOARD PUBLIC
app.get("/", (req, res) => {

    const stats = {
        totalArtikel: 68,
        hariNasional: 42,
        hariInternasional: 85,
        rekomendasiBulan: "Jepang",
        updateLibur: 3
    };

    const calendarInfo = {
        bulan: "November 2025",
        hariIni: 27,
        eventBulanIni: [
            { tanggal: 10, nama: "Hari Pahlawan" },
            { tanggal: 14, nama: "Hari Diabetes Sedunia" },
            { tanggal: 20, nama: "Hari Anak Sedunia" },
            { tanggal: 25, nama: "Hari Guru Indonesia" }
        ]
    };

    res.render("index", {
        layout: "layouts/main",
        title: "Dashboard",
        stats,
        calendarInfo
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
