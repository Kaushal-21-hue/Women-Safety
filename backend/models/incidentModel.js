const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
    {
        uname: {
            type: String,
            required: true,
        },
        report: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);