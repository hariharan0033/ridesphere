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


// Fetch rides based on pickup & drop-off
router.get("/search", async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng } = req.query;

    if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
      return res.status(400).json({ error: "Missing location parameters" });
    }

    // Convert query params to numbers
    const pickupLatitude = parseFloat(pickupLat);
    const pickupLongitude = parseFloat(pickupLng);
    const dropLatitude = parseFloat(dropLat);
    const dropLongitude = parseFloat(dropLng);

    // Step 1: Exact match
    let rides = await Ride.find({
      "pickupLocation.coordinates.lat": pickupLatitude,
      "pickupLocation.coordinates.lng": pickupLongitude,
      "dropoffLocation.coordinates.lat": dropLatitude,
      "dropoffLocation.coordinates.lng": dropLongitude,
      status: "upcoming",
      availableSeats: { $gt: 0 },
    }).populate("driverId", "name");

    // Step 2: If no exact match, find nearby rides using MongoDB geospatial query
    if (rides.length === 0) {
      const radius = 0.02; // 2km in radians (Earth’s radius = 6371km)

      rides = await Ride.find({
        "pickupLocation.coordinates": {
          $geoWithin: { $centerSphere: [[pickupLongitude, pickupLatitude], radius] },
        },
        "dropoffLocation.coordinates": {
          $geoWithin: { $centerSphere: [[dropLongitude, dropLatitude], radius] },
        },
        status: "upcoming",
        availableSeats: { $gt: 0 },
      }).populate("driverId", "name");
    }

    res.json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
