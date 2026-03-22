const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lat: {
            type: String,
            required: true,
        },
        long: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "SOS_SENT",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Emergency", emergencySchema);