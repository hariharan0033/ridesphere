import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { api } from "../services/api";
import { useSelector } from "react-redux";

const BookRideScreen = () => {
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const passengerId = useSelector((state) => state.auth.user.id);

    // Function to fetch coordinates from OpenStreetMap
    const getCoordinates = async (query) => {
        if (!query) return null;
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
                {
                    headers: {
                        "User-Agent": "RideSphere/1.0 (contact@ridesphere.com)",
                        "Accept-Language": "en",
                    },
                }
            );

            if (response.data.length > 0) {
                const { lat, lon, display_name } = response.data[0];
                return { lat: parseFloat(lat), lng: parseFloat(lon), address: display_name };
            }
            return null;
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return null;
        }
    };

    // Function to search for rides
    const searchRides = async () => {
        setError("");
        setRides([]);
        setLoading(true);

        if (!pickup || !dropoff) {
            setError("Please enter both pickup and drop-off locations.");
            setLoading(false);
            return;
        }

        const pickupData = await getCoordinates(pickup);
        const dropoffData = await getCoordinates(dropoff);

        if (!pickupData || !dropoffData) {
            setError("Could not fetch coordinates. Please try again.");
            setLoading(false);
            return;
        }

        try {
            // Fetch available rides
            const rideResponse = await api.get("/rides/search", {
                params: {
                    pickupLat: pickupData.lat,
                    pickupLng: pickupData.lng,
                    dropLat: dropoffData.lat,
                    dropLng: dropoffData.lng,
                },
            });

            let availableRides = rideResponse.data;
            
            // Fetch passenger's booked rides
            const bookingResponse = await api.get(`/bookings?passengerId=${passengerId}`);
            const bookedRideIds = bookingResponse.data.map((booking) => booking.rideId);

            // Filter out already booked rides
            availableRides = availableRides.filter(
                (ride) => !bookedRideIds.includes(ride._id) && ride.driverId._id !== passengerId
            );

            setRides(availableRides);
        } catch (error) {
            console.error("Error searching rides:", error);
            setError("Failed to fetch rides. Try again.");
        }

        setLoading(false);
    };

    // Function to handle ride booking
    const bookRide = async (rideId) => {
        try {
            await api.post("/bookings", {
                rideId,
                passengerId,
                seatsBooked: 1,
            });

            Alert.alert("Success", "Ride booked successfully!");
        } catch (error) {
            console.error("Error booking ride:", error);
            Alert.alert("Error", "Failed to book ride. Try again.");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Book a Ride</Text>

            <TextInput
                placeholder="Enter Pickup Location"
                value={pickup}
                onChangeText={setPickup}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
            />
            <TextInput
                placeholder="Enter Drop-off Location"
                value={dropoff}
                onChangeText={setDropoff}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
            />

            <TouchableOpacity
                onPress={searchRides}
                style={{ backgroundColor: "blue", padding: 15, borderRadius: 5, alignItems: "center" }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Search Rides</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />}

            {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

            <FlatList
                data={rides}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const istDate = new Date(item.dateTime);

                    const formattedDate = istDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });

                    const formattedTime = istDate.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });

                    return (
                        <View
                            style={{
                                backgroundColor: "#fff",
                                padding: 15,
                                marginVertical: 8,
                                marginHorizontal: 10,
                                borderRadius: 10,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 4,
                                borderLeftWidth: 5,
                                borderLeftColor: item.vehicleType === "car" ? "#007bff" : "#28a745",
                            }}
                        >
                            {/* Driver Info */}
                            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
                                🚗 Driver: {item.driverId.name}
                            </Text>

                            {/* Ride Date & Time */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: "#333" }}>📅 {formattedDate}</Text>
                                <Text style={{ fontSize: 14, color: "#333" }}>⏰ {formattedTime}</Text>
                            </View>

                            {/* Pickup Location */}
                            <View style={{ marginBottom: 6 }}>
                                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#555" }}>📍 Pickup Location</Text>
                                <Text style={{ fontSize: 12, color: "#222" }}>{item.pickupLocation.address}</Text>
                            </View>

                            {/* Dropoff Location */}
                            <View style={{ marginBottom: 6 }}>
                                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#555" }}>📍 Drop-off Location</Text>
                                <Text style={{ fontSize: 12, color: "#222" }}>{item.dropoffLocation.address}</Text>
                            </View>

                            {/* Ride Details */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: "#333" }}>🚘 {item.vehicleType.toUpperCase()}</Text>
                                <Text style={{ fontSize: 14, color: "#333" }}>💺 {item.availableSeats} Seats</Text>
                                <Text style={{ fontSize: 14, color: "#555", marginBottom: 10 }}>📏 Distance: {item.distance.toFixed(1)} km</Text>
                            </View>

                            {/* Price */}
                            <Text style={{ fontSize: 18, color: "#28a745", fontWeight: "bold" }}>💰 ₹{item.price}</Text>

                            {/* Book Button */}
                            <TouchableOpacity
                                onPress={() => bookRide(item._id)}
                                style={{
                                    backgroundColor: "#007bff",
                                    padding: 12,
                                    borderRadius: 8,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Book Ride</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />
        </View>
    );
};

export default BookRideScreen;
