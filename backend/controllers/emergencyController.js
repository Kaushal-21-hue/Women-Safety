const Emergency = require("../models/Emergency");

exports.emergencyPressedController = async (req, res) => {
    try {
        const { userId, lat, long } = req.body;

        if (!userId || !lat || !long) {
            return res.status(400).send({
                success: false,
                message: "Missing fields",
            });
        }

        const sos = await Emergency.create({
            userId,
            lat,
            long,
        });

        res.status(200).send({
            success: true,
            message: "SOS Sent Successfully",
            sos,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error sending SOS",
        });
    }
};