const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    phone: String,
    emergencyNo: String,
    emergencyMail: String,
    pincode: String,
    password: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

