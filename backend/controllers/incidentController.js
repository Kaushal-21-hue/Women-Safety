const Incident = require("../models/incidentModel");

// CREATE INCIDENT
exports.createIncident = async (req, res) => {
    try {
        const { report, address, pincodeOfIncident, uname } = req.body;
        const pincode = pincodeOfIncident || pincode;
        const newIncident = new Incident({
            uname: uname || 'Anonymous',
            report,
            address,
            pincode
        });
        await newIncident.save();
        res.status(201).json(newIncident);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error creating incident",
        });
    }
};


// GET ALL INCIDENTS
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        res.status(200).json(incidents);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching incidents",
        });
    }
};;
