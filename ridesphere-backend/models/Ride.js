const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: {
      address: { type: String, required: true, trim: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (coords) {
            return coords.length === 2;
          },
          message: "Coordinates must have [longitude, latitude]",
        },
      },
    },
    dropoffLocation: {
      address: { type: String, required: true, trim: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (coords) {
            return coords.length === 2;
          },
          message: "Coordinates must have [longitude, latitude]",
        },
      },
    },
    dateTime: { type: Date, required: true },
    vehicleType: { 
      type: String, 
      enum: ["bike", "car"], 
      required: true 
    },
    availableSeats: { 
      type: Number, 
      required: true, 
      min: 0, 
      default: 1, 
    },
    distance: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "booked", "started", "completed"], 
      default: "pending" 
    },
    bookedRiders: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId or Array
      default: function () {
        return this.vehicleType === "car" ? [] : null; // Default empty array for cars, null for bikes
      },
      validate: {
        validator: function (value) {
          if (this.vehicleType === "bike") {
            return mongoose.Types.ObjectId.isValid(value) || value === null;
          }
          return Array.isArray(value);
        },
        message: "Invalid bookedRiders format",
      },
    },
  },
  { timestamps: true }
);

// ✅ Create geospatial indexes for efficient location-based queries
RideSchema.index({ "pickupLocation.coordinates": "2dsphere" });
RideSchema.index({ "dropoffLocation.coordinates": "2dsphere" });

module.exports = mongoose.model("Ride", RideSchema);
