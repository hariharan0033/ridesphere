import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import axios from "axios";

const RideDetailsScreen = ({ navigation, route }) => {
    const { pickupCoords, dropoffCoords } = route.params;

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [vehicleType, setVehicleType] = useState(null);
    const [seats, setSeats] = useState(1);
    const [price, setPrice] = useState(0);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (pickupCoords && dropoffCoords) {
            fetchDistance();
        }
    }, [pickupCoords, dropoffCoords]);

    const fetchDistance = async () => {
        try {
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${pickupCoords.longitude},${pickupCoords.latitude};${dropoffCoords.longitude},${dropoffCoords.latitude}?overview=false&steps=false`
            );
            const distanceInMeters = response.data.routes[0].distance;
            const distanceInKm = (distanceInMeters / 1000).toFixed(2);
            setDistance(distanceInKm);
        } catch (error) {
            console.error("Error fetching distance:", error);
            Alert.alert("Error", "Failed to fetch distance. Try again.");
        }
    };

    const calculatePrice = () => {
        const baseFare = 50;
        const perKmRate = 10;
        const totalPrice = baseFare + perKmRate * distance;
        setPrice(vehicleType === "bike" ? totalPrice : totalPrice / seats);
    };

    const handleSubmit = () => {
        if (!vehicleType) {
            Alert.alert("Error", "Please select a vehicle type.");
            return;
        }

        const rideDetails = {
            pickupCoords,
            dropoffCoords,
            date,
            vehicleType,
            seats,
            price,
            distance
        };

        console.log("Ride Details:", rideDetails);
        // Send data to backend here
        navigation.navigate("Home");
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date; // Ensure the date doesn't get set to `undefined`
        setDate(currentDate);
    };

    if (Platform.OS === "android") {
        const showMode = (currentMode) => {
            DateTimePickerAndroid.open({
                value: date,
                onChange,
                mode: currentMode,
                is24Hour: false,
            });
        };

        const showDatepicker = () => {
            showMode("date");
        };

        const showTimepicker = () => {
            showMode("time");
        };

        return (
            <View style={styles.container}>
                <Pressable onPress={showDatepicker}>
                    <Text>Select Date</Text>
                </Pressable>
                <Pressable onPress={showTimepicker}>
                    <Text>Select Time</Text>
                </Pressable>

                <Button title="🚲 Bike" onPress={() => { setVehicleType("bike"); setSeats(1); calculatePrice(); }} />
                <Button title="🚗 Car" onPress={() => { setVehicleType("car"); calculatePrice(); }} />

                {vehicleType === "car" && (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Enter Number of Seats"
                        onChangeText={(value) => {
                            const numSeats = parseInt(value) || 1;
                            setSeats(numSeats);
                            calculatePrice();
                        }}
                    />
                )}
                
                <Text>Distance: {distance} km</Text>
                <Text>Estimated Price: ₹{price}</Text>
                
                <Button title="Submit Ride" onPress={handleSubmit} />
                <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
            </View>
        );
    } else {
        // For iOS, DateTimePicker is handled differently
        return (
            <View style={styles.container}>
                <DateTimePicker
                    style={{ width: 200 }}
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                />
                <Text>{date.toLocaleString()}</Text>

                <Button title="🚲 Bike" onPress={() => { setVehicleType("bike"); setSeats(1); calculatePrice(); }} />
                <Button title="🚗 Car" onPress={() => { setVehicleType("car"); calculatePrice(); }} />

                {vehicleType === "car" && (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Enter Number of Seats"
                        onChangeText={(value) => {
                            const numSeats = parseInt(value) || 1;
                            setSeats(numSeats);
                            calculatePrice();
                        }}
                    />
                )}
                
                <Text>Distance: {distance} km</Text>
                <Text>Estimated Price: ₹{price}</Text>
                
                <Button title="Submit Ride" onPress={handleSubmit} />
                <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    input: { borderWidth: 1, borderColor: "gray", padding: 10, marginVertical: 10 },
});

export default RideDetailsScreen;
