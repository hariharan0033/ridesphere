import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert ,StyleSheet, Image, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"; 

import axios from "axios";
import { api } from "../services/api";
import { capitalize } from '../utils/capitalize';
import { useSelector } from "react-redux";

const BookRideScreen = ({ navigation }) => {
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
                    dropoffLat: dropoffData.lat,
                    dropoffLng: dropoffData.lng,
                },
            });

            let availableRides = rideResponse.data;
            
            // Fetch passenger's booked rides
            
            setRides(availableRides);
        } catch (error) {
            console.error("Error searching rides:", error);
            setError("Failed to fetch rides. Try again.");
        }

        setLoading(false);
    };

    // Function to handle ride booking
    const bookRide = async (rideId) => {
        Alert.alert(
            "Confirm Booking",
            "Are you sure you want to book this ride?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            const response = await api.post(`/rides/book/${rideId}`);

                            Alert.alert("Success", "Ride booked successfully!");
                            navigation.navigate("BookingConfirmation", {
                              rideDetails: response.data.updatedRide, // Pass ride details
                            });
    
                        } catch (error) {
                            console.error("Error booking ride:", error.message);
                            Alert.alert("Error", "Failed to book ride. Try again.");
                        }
                    },
                },
            ]
        );
    };
    
    

    return (
        <SafeAreaView style={styles.safeContainer}>
        <View style={{ flex: 1, padding: 20 }}>

            <TextInput
                placeholder="Enter Pickup Location"
                value={pickup}
                onChangeText={setPickup}
                placeholderTextColor="#d0d0d0"
                style={{
                    borderWidth: 1,
                    borderColor: "#b8b8b8",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 50,
                    fontSize: 16,
                    marginBottom: 15,
                    backgroundColor: "#fff",
                }}
            />
            <TextInput
                placeholder="Enter Drop-off Location"
                value={dropoff}
                onChangeText={setDropoff}
                placeholderTextColor="#d0d0d0"
                style={{
                    borderWidth: 1,
                    borderColor: "#b8b8b8",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 50,
                    fontSize: 16,
                    marginBottom: 15,
                    backgroundColor: "#fff",
                }}
            />

            <TouchableOpacity
                onPress={searchRides}
                style={{
                    backgroundColor:  pickup && dropoff ? "#008955" : "#B0B0B0",
                    padding: 15,
                    borderRadius: 8,
                    alignItems: "center",
                    height: 54,
                }}
                disabled={!pickup || !dropoff}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                    Search Rides
                </Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#008955" style={{ marginTop: 15 }} />}
        

            {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

            {rides.length === 0 && !loading ? (
                    <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" }}>
                        😕 No rides found. Try a different search.
                    </Text>
                ) : (
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
    backgroundColor: "#E2F5ED",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#008955",
  }}
>
  {/* Pickup & Dropoff Locations */}
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="map-marker-alt" size={18} color="#008955" />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#555", marginLeft: 5 }}>
          {capitalize(item.pickupLocation.address)}
        </Text>
      </View>

      <View style={{ marginLeft: 10 }}>
        <MaterialIcons name="arrow-downward" size={18} color="#555" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="map-marker-alt" size={18} color="#008955" />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#555", marginLeft: 5 }}>
          {capitalize(item.dropoffLocation.address)}
        </Text>
      </View>
    </View>

    {/* Vehicle Image */}
    <Image 
      source={item.vehicleType === 'car' ? require('../assets/Car.png') : require('../assets/Bike.png')} 
      style={{ width: 50, height: 50, borderRadius: 8 }} 
    />
  </View>

  {/* Ride Info */}
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FontAwesome5 name="calendar-alt" size={14} color="#333" />
      <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>{formattedDate}</Text>
    </View>

    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FontAwesome5 name="clock" size={14} color="#333" />
      <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>{formattedTime}</Text>
    </View>
  </View>

  {/* Seats & Driver */}
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FontAwesome5 name="chair" size={14} color="#333" />
      <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>{item.availableSeats} Seats</Text>
    </View>

    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FontAwesome5 name="user" size={14} color="#333" />
      <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>{item.driver.name}</Text>
    </View>
  </View>

  {/* Price & Book Ride Button */}
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#008955" }}>₹{item.price}</Text>

    <TouchableOpacity
      onPress={() => bookRide(item._id)}
      style={{
        backgroundColor: "#008955",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: 150,
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Book Ride</Text>
    </TouchableOpacity>
  </View>
</View>
    );
  }}
/>
                )}
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#fff", 
        paddingTop: Platform.OS === "android" ? 30 : 0, // Extra padding for Android status bar
    },
});

export default BookRideScreen;