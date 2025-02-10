const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    dropoffLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    dateTime: {
      type: Date,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "car"],
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    distance: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", RideSchema);
