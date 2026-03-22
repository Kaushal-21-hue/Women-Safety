const express = require("express");
const router = express.Router();

const {
    emergencyPressedController,
} = require("../controllers/emergencyController");

const { requireSignIn } = require("../middleware/authMiddleware");

// POST SOS
router.post(
    "/emergencypressed",
    requireSignIn,
    emergencyPressedController
);

module.exports = router;