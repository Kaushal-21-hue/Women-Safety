const Incident = require("../models/incidentModel");

// CREATE INCIDENT
exports.createIncident = async (req, res) => {
    try {
        const { uname, report, address, pincode } = req.body;
        const newIncident = new Incident({ uname, report, address, pincode });
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
