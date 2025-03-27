const express = require("express");
const { createRide, searchRides, bookRide, getMyRides, getMyBookings ,getUpcomingRides} = require("../controllers/rideController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new ride (Only authenticated users)
router.post("/post", protect, createRide);

// Search for rides
router.get("/search", protect, searchRides);

// Book a ride
router.post("/book/:rideId", protect, bookRide);

// Get all rides posted by driver
router.get("/my-rides", protect, getMyRides); 

// Get all booked rides by passenger
router.get("/my-bookings", protect, getMyBookings);

// Get upcoming rides of passenger
router.get("/upcoming-rides", protect, getUpcomingRides);


module.exports = router;
