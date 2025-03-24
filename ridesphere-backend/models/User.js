const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10, // Minimum 10 digits
      maxlength: 15, // Max length to support international numbers
    },
    homeAddress: {
      type: String,
      default: "", // Optional field
      trim: true,
    },
    upiId: {
      type: String,
      default: "", // Optional field
      trim: true,
    },
    profilePic: {
      type: String,
      default: "", // Stores profile picture URL
    },
    offeredRides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride", // References the Ride model
      },
    ],
    bookedRides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride", // References the Ride model
      },
    ],
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
