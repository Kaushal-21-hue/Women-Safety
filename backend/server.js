// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ================= CONFIG =================
dotenv.config();
connectDB();

const app = express();

// ================= CORS SETUP =================

// Allowed frontends
const allowedOrigins = [
    "http://localhost:3000",                 // React local
    "https://womensecfrontend.onrender.com" // deployed frontend (change if needed)
];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (mobile apps, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Enable CORS
app.use(cors(corsOptions));

// ✅ Preflight OPTIONS handled automatically by cors() middleware above
// Removed: app.options("*", cors(corsOptions)) - invalid wildcard, causes PathError

// ================= MIDDLEWARE =================

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/v1/emergency", require("./routes/emergencyRoutes"));
app.use("/api/v1/incidents", require("./routes/incidentRoutes"));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
    res.status(200).send("Backend Running 🚀");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});