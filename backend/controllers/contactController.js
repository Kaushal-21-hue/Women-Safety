const Contact = require("../models/Contact");

exports.sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        res.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

