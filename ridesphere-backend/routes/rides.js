const express = require("express");
const Ride = require("../models/Ride");
const router = express.Router();
const mongoose = require("mongoose");


//  POST /api/rides - Create a new ride
router.post("/", async (req, res) => {
  try {
    const { driverId, pickupLocation, dropoffLocation, dateTime, vehicleType, availableSeats, distance, price } = req.body;

    // Validation: Ensure all required fields are present
    if (!driverId || !pickupLocation || !dropoffLocation || !dateTime || !vehicleType || !availableSeats || !distance || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRide = new Ride({
      driverId : new mongoose.Types.ObjectId(driverId),
      pickupLocation,
      dropoffLocation,
      dateTime,
      vehicleType,
      availableSeats,
      distance,
      price,
    });

    await newRide.save();
    res.status(201).json({ message: "Ride created successfully!", ride: newRide });

  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
