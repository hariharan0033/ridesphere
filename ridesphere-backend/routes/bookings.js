const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

const router = express.Router();

// 📌 BOOK A RIDE (Passenger books a ride)
router.post("/", async (req, res) => {
    const session = await mongoose.startSession(); // Start a transaction
    session.startTransaction();

    try {
        const { rideId, passengerId, seatsBooked } = req.body;

        if (!rideId || !passengerId || !seatsBooked) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1️⃣ Check if ride exists
        const ride = await Ride.findById(rideId).session(session);
        if (!ride) {
            await session.abortTransaction();
            return res.status(404).json({ error: "Ride not found" });
        }

        // 2️⃣ Check for duplicate booking (same passenger booking the same ride)
        const existingBooking = await Booking.findOne({ rideId, passengerId }).session(session);
        if (existingBooking) {
            await session.abortTransaction();
            return res.status(409).json({ error: "You have already booked this ride" });
        }

        // 3️⃣ Check if enough seats are available
        if (ride.availableSeats < seatsBooked) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Not enough seats available" });
        }

        // 4️⃣ Create the booking
        const booking = new Booking({
            rideId,
            passengerId,
            seatsBooked,
            status: "confirmed",
        });
        await booking.save({ session });

        // 5️⃣ Update available seats in the Ride document
        ride.availableSeats -= seatsBooked;
        await ride.save({ session });

        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        res.status(201).json({ message: "Ride booked successfully", booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error booking ride:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { passengerId } = req.query;
        let filter = {};

        if (passengerId) {
            filter.passengerId = passengerId;
        }

        const bookings = await Booking.find(filter).select("rideId");
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
