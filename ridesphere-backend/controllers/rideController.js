const Ride = require("../models/Ride");
const User = require("../models/User");
// @desc    Create a new ride
// @route   POST /api/rides/post
// @access  Private
const createRide = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      dateTime,
      vehicleType,
      availableSeats,
      distance,
      price,
    } = req.body;
    const driverId = req.user._id; // Logged-in user

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !dateTime ||
      !vehicleType ||
      !availableSeats ||
      !distance ||
      !price
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create ride
    const newRide = new Ride({
      driverId,
      pickupLocation,
      dropoffLocation,
      dateTime,
      vehicleType,
      availableSeats,
      distance,
      price,
      status: "pending",
    });

    await newRide.save();

    // ✅ Add ride to driver's profile
    await User.findByIdAndUpdate(driverId, {
      $push: { offeredRides: newRide._id },
    });

    res
      .status(201)
      .json({ message: "Ride posted successfully", ride: newRide });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search for available rides
// @route   GET /api/rides/search
// @access  Private
const searchRides = async (req, res) => {
  const { pickupLng, pickupLat, dropoffLng, dropoffLat } = req.query;
  const userId = req.user._id;

  try {
    if (!pickupLng || !pickupLat || !dropoffLng || !dropoffLat) {
      return res.status(400).json({ message: "Pickup and drop-off coordinates are required" });
    }

    const currentTime = new Date(); // Get current time

    const rides = await Ride.aggregate([
      {
        $geoNear: {
          key: "pickupLocation.coordinates", // ✅ Specify the correct index
          near: { type: "Point", coordinates: [parseFloat(pickupLng), parseFloat(pickupLat)] },
          distanceField: "pickupDistance",
          maxDistance: 5000, // 5km radius for pickup
          spherical: true
        }
      },
      {
        $match: {
          driverId: { $ne: userId }, // ✅ Exclude rides posted by the same user
          "dropoffLocation.coordinates": {
            $geoWithin: {
              $centerSphere: [[parseFloat(dropoffLng), parseFloat(dropoffLat)], 5 / 6378.1] // 5km radius for dropoff
            }
          },
          dateTime: { $gte: currentTime }, // Only upcoming rides
          availableSeats: { $gt: 0 },
          status: { $in: ["pending", "booked"] },
          bookedRiders: { $nin: [userId] }
        }
      },
      { $sort: { pickupDistance: 1 } }, // Sort by nearest pickup location
      {
        $lookup: {
          from: "users",
          localField: "driverId",
          foreignField: "_id",
          as: "driverDetails"
        }
      },
      { $unwind: "$driverDetails" },
      {
        $project: {
          _id: 1,
          pickupLocation: 1,
          dropoffLocation: 1,
          dateTime: 1,
          availableSeats: 1,
          price: 1,
          vehicleType: 1,
          driver: {
            name: "$driverDetails.name",
            mobileNumber: "$driverDetails.mobileNumber",
          }
        }
      }
    ]);


    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @desc    Book a ride
// @route   POST /api/rides/book/:rideId
// @access  Private
const bookRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user._id;

    // Find the ride
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    // Prevent duplicate bookings
    if (
      // Check for car
      ride.vehicleType === "car" &&
      Array.isArray(ride.bookedRiders) &&
      ride.bookedRiders.some((rider) => rider.toString() === userId.toString())
    ) {

      return res
        .status(400)
        .json({ message: "You have already booked this ride" });
    }

    // Ensure available seats
    if (ride.availableSeats < 1) {
      return res
        .status(400)
        .json({ message: "No seats available for this ride" });
    }

    // Add rider to bookedRiders
    if (ride.vehicleType === "car") {
      ride.bookedRiders.push(userId); // Push userId to array for cars
    } else {
      ride.bookedRiders = userId; // Store userId directly for bikes
    }
    // ride.availableSeats -= 1; // Decrease seat count

    // Update ride status
    if (ride.availableSeats === 0) {
      ride.status = "booked"; // Mark ride as fully booked
    }

    let updateQuery = { $inc: { availableSeats: -1 } };

    if (ride.vehicleType === "bike") {
      updateQuery.bookedRiders = userId; // Directly set userId (not an array)
    } else {
      updateQuery.$push = { bookedRiders: userId }; // Push to array for cars
    }

    // Apply the update
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: rideId },
      updateQuery,
      { new: true }
    ) .populate("driverId", "name");

    // ✅ Add ride to user's profile
    await User.findByIdAndUpdate(userId, { $push: { bookedRides: ride._id } });

    res.status(200).json({ message: "Ride booked successfully", updatedRide });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get rides posted by the logged-in user (Driver)
// @route   GET /api/rides/my-rides
// @access  Private
const getMyRides = async (req, res) => {
  try {
    const driverId = req.user._id;

    const rides = await Ride.find({ driverId })
    .populate({
      path: "bookedRiders", // Ensure this matches the field in the schema
      model: "User", // Explicitly specify the referenced model
      select: "name mobileNumber", // Select only necessary fields
    })
    .sort({ dateTime: 1 });


    if (!rides.length) {
      return res.status(404).json({ message: "No rides posted yet" });
    }

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get rides booked by the logged-in user (Passenger)
// @route   GET /api/rides/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch rides where the user is in bookedRiders
    const rides = await Ride.find({ bookedRiders: userId })
      .populate("driverId", "name mobileNumber") // Populate only driver details
      .sort({ dateTime: 1 });

    if (!rides.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching bookings:", error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {
  createRide,
  searchRides,
  bookRide,
  getMyRides,
  getMyBookings,
};
