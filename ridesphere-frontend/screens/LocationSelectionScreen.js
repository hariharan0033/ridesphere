import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LocationSelectionScreen = () => {
    const navigation = useNavigation();
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonState, setButtonState] = useState("showRoute"); // "showRoute" or "proceed"
    const [distance, setDistance] = useState(null); // To store calculated distance

    const mapRef = useRef(null);

    const collegeCoords = { latitude: 13.0261044, longitude: 80.0162591 };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: collegeCoords.latitude,
                longitude: collegeCoords.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            }, 1000);
        }
    }, []);

    const searchLocation = async (query, type) => {
        if (!query) return;

        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
                { headers: { "User-Agent": "RideSphere/1.0", "Accept-Language": "en" } }
            );

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const coords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

                if (type === "pickup") {
                    setPickupCoords(coords);
                } else {
                    setDropoffCoords(coords);
                }

                // Remove the previous route when location changes
                setRouteCoords([]);
                setDistance(null);
                setButtonState("showRoute");
            } else {
                Alert.alert("Location not found", "Please enter a valid location.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch location. Try again.");
        }
    };

    const fetchRoute = async () => {
        if (!pickupCoords || !dropoffCoords) return;

        setLoading(true);
        setButtonState("loading");

        try {
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${pickupCoords.longitude},${pickupCoords.latitude};${dropoffCoords.longitude},${dropoffCoords.latitude}?overview=full&geometries=geojson`
            );

            const routeData = response.data.routes[0]?.geometry?.coordinates || [];
            const routeDistance = response.data.routes[0]?.distance || 0; // Distance in meters

            if (routeData.length > 0) {
                setRouteCoords(routeData.map(coord => ({ latitude: coord[1], longitude: coord[0] })));
                setDistance((routeDistance / 1000).toFixed(2)); // Convert meters to kilometers
                setButtonState("proceed");
            } else {
                Alert.alert("No Route Found", "Unable to find a route between these locations.");
                setButtonState("showRoute");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch route. Try again.");
            setButtonState("showRoute");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pickupCoords && !dropoffCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: pickupCoords.latitude,
                longitude: pickupCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        } else if (pickupCoords && dropoffCoords && mapRef.current) {
            mapRef.current.fitToCoordinates([pickupCoords, dropoffCoords], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [pickupCoords, dropoffCoords]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mapContainer}>
                <MapView ref={mapRef} style={styles.map}>
                    <Marker coordinate={collegeCoords} title="Saveetha Engineering College" pinColor="green" />
                    {pickupCoords && <Marker coordinate={pickupCoords} title="Pickup" pinColor="blue" />}
                    {dropoffCoords && <Marker coordinate={dropoffCoords} title="Drop-off" pinColor="red" />}
                    {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={3} strokeColor="blue" />}
                </MapView>
            </View>

            <View style={styles.bottomContainer}>
                <TextInput style={styles.input} placeholder="Enter Pickup Location" value={pickup} onChangeText={setPickup} onSubmitEditing={() => searchLocation(pickup, "pickup")} />
                <TextInput style={styles.input} placeholder="Enter Drop-off Location" value={dropoff} onChangeText={setDropoff} onSubmitEditing={() => searchLocation(dropoff, "dropoff")} />

                {/* Distance Display */}
                {distance && (
                    <Text style={styles.distanceText}>
                        Distance: {distance} km
                    </Text>
                )}

                <TouchableOpacity
    style={[styles.button, (loading || !pickupCoords || !dropoffCoords) && styles.disabledButton]}
    onPress={buttonState === "showRoute" ? fetchRoute : () => navigation.navigate("VehicleSelection", { 
        pickupLocation: { address: pickup, coordinates: pickupCoords }, 
        dropoffLocation: { address: dropoff, coordinates: dropoffCoords }, 
        distance 
    })}
    disabled={loading || !pickupCoords || !dropoffCoords}
>
    {loading ? (
        <ActivityIndicator size="small" color="#fff" />
    ) : (
        <Text style={styles.buttonText}>{buttonState === "showRoute" ? "Show Route" : "Proceed"}</Text>
    )}
</TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
    mapContainer: { flex: 1 },
    map: { flex: 1 },
    bottomContainer: {
        padding: 15,
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        paddingBottom: 80,
    },
    input: {
        backgroundColor: "#eee",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    distanceText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#008955",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#aaa",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default LocationSelectionScreen;
