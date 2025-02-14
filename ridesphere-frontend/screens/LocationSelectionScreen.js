import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

const LocationSelectionScreen = ({ navigation }) => {
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [pickupAddress, setPickupAddress] = useState("");  
    const [dropoffAddress, setDropoffAddress] = useState("");  
    const [collegeCoords, setCollegeCoords] = useState({
        latitude: 13.0261044,
        longitude: 80.0162591,
    });
    const [routeCoords, setRouteCoords] = useState([]);

    const mapRef = useRef(null); // MapView reference

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
                {
                    headers: {
                        "User-Agent": "RideSphere/1.0 (contact@ridesphere.com)",
                        "Accept-Language": "en",
                    },
                }
            );

            if (response.data.length > 0) {
                const { lat, lon, display_name } = response.data[0];
                const coords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
                const address = display_name; 

                if (type === "pickup") {
                    setPickup(query);
                    setPickupCoords(coords);
                    setPickupAddress(address);
                } else {
                    setDropoff(query);
                    setDropoffCoords(coords);
                    setDropoffAddress(address);
                }

                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }, 1000);
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
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${pickupCoords.longitude},${pickupCoords.latitude};${dropoffCoords.longitude},${dropoffCoords.latitude}?overview=full&geometries=geojson`
            );

            const routeData = response.data.routes[0]?.geometry?.coordinates || [];

            if (routeData.length > 0) {
                const coordinates = routeData.map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));

                setRouteCoords([...coordinates]); 

                if (mapRef.current) {
                    mapRef.current.fitToCoordinates([pickupCoords, dropoffCoords], {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    });
                }
            } else {
                setRouteCoords([]);
                Alert.alert("No Route Found", "Unable to find a route between these locations.");
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            Alert.alert("Error", "Failed to fetch route. Try again.");
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
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
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: collegeCoords.latitude,
                        longitude: collegeCoords.longitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                >
                    <Marker
                        coordinate={collegeCoords}
                        title="Saveetha Engineering College"
                        description="NH48, Palanjur, Sriperumbudur, Tamil Nadu"
                    />

                    {pickupCoords && <Marker coordinate={pickupCoords} title="Pickup" pinColor="blue" />}
                    {dropoffCoords && <Marker coordinate={dropoffCoords} title="Drop-off" pinColor="red" />}
                    {routeCoords.length > 0 && (
                        <Polyline coordinates={routeCoords} strokeWidth={3} strokeColor="blue" />
                    )}
                </MapView>

                <Button
                    title="Proceed"
                    onPress={() => 
                        navigation.navigate("RideDetails", {
                            pickupCoords,
                            dropoffCoords,
                            pickupAddress,
                            dropoffAddress,
                        })
                    }
                    disabled={!pickupCoords || !dropoffCoords}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#fff", 
        paddingTop: Platform.OS === "android" ? 30 : 0, // Extra padding for Android status bar
    },
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    map: {
        flex: 1,
        marginVertical: 10,
    },
});

export default LocationSelectionScreen;
