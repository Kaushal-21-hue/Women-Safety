const express = require("express");
const router = express.Router();

const {
    getAllIncidents,
    createIncident
} = require("../controllers/incidentController");

// GET incidents
router.get("/", getAllIncidents);

// POST incident
router.post("/", createIncident);

module.exports = router;
