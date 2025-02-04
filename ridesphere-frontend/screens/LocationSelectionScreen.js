import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

const LocationSelectionScreen = ({ navigation }) => {
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);

    // ✅ Fix: Add User-Agent header to prevent API blocking
    const searchLocation = async (query, type) => {
        try {
            if (!query) return; // Prevent empty search
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
                {
                    headers: {
                        "User-Agent": "MyRideShareApp/1.0 (myapp@email.com)", // Update this
                        "Accept-Language": "en",
                    },
                }
            );
            console.log(response.data.length);
            
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const coords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

                if (type === "pickup") {
                    setPickup(query);
                    setPickupCoords(coords);
                } else {
                    setDropoff(query);
                    setDropoffCoords(coords);
                }
            } else {
                Alert.alert("Location not found", "Please enter a valid location.");
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            Alert.alert("Error", "Failed to fetch location. Try again.");
        }
    };


    const fetchRoute = async () => {
        if (!pickupCoords || !dropoffCoords) {
            Alert.alert("Error", "Please select valid pickup and drop-off locations.");
            return;
        }

        try {
            console.log("Fetching route from:", pickupCoords, "to", dropoffCoords);

            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${pickupCoords.longitude},${pickupCoords.latitude};${dropoffCoords.longitude},${dropoffCoords.latitude}?overview=full&geometries=geojson`
            );

            const routeData = response.data.routes[0]?.geometry?.coordinates || [];

            if (routeData.length > 0) {
                const coordinates = routeData.map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));

                setRouteCoords([...coordinates]); // ✅ Ensures state updates correctly            
            } else {
                Alert.alert("No Route Found", "Unable to find a route between these locations.");
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            Alert.alert("Error", "Failed to fetch route. Try again.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter Pickup Location"
                value={pickup}
                onChangeText={setPickup}
                onSubmitEditing={() => searchLocation(pickup, "pickup")}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Drop-off Location"
                value={dropoff}
                onChangeText={setDropoff}
                onSubmitEditing={() => searchLocation(dropoff, "dropoff")}
            />
            <Button title="Show Route" onPress={fetchRoute} disabled={!pickupCoords || !dropoffCoords} />

            <MapView 
                key={routeCoords.length} // ✅ Forces re-render on route update
                style={styles.map} 
                region={{
                    latitude: pickupCoords ? pickupCoords.latitude : 37.7749,
                    longitude: pickupCoords ? pickupCoords.longitude : -122.4194,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {pickupCoords && <Marker coordinate={pickupCoords} title="Pickup" />}
                {dropoffCoords && <Marker coordinate={dropoffCoords} title="Drop-off" />}
                {routeCoords.length > 0 && (
                    <Polyline coordinates={routeCoords} strokeWidth={3} strokeColor="blue" />
                )}
            </MapView>

            <Button 
                title="Proceed" 
                onPress={() => navigation.navigate("RideDetails", { pickupCoords, dropoffCoords })} 
                disabled={!pickupCoords || !dropoffCoords} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    input: { height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
    map: { flex: 1, marginVertical: 10 },
});

export default LocationSelectionScreen;
