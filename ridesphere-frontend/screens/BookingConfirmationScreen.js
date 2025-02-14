import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";

const BookingConfirmationScreen = ({ route }) => {
    const { booking, rideDetails } = route.params;
    const navigation = useNavigation(); // Get navigation

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>🎉 Booking Confirmed! 🎉</Text>
                </View>

                {/* Ride Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🚖 Ride Details</Text>

                    <View style={styles.detailBlock}>
                        <Text style={styles.label}>📍 Pickup:</Text>
                        <Text style={styles.value}>{rideDetails.pickup.address}</Text>
                    </View>

                    <View style={styles.detailBlock}>
                        <Text style={styles.label}>📍 Drop-off:</Text>
                        <Text style={styles.value}>{rideDetails.dropoff.address}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>📅 Date & Time:</Text>
                        <Text style={styles.value}>{new Date(rideDetails.dateTime).toLocaleString()}</Text>
                    </View>
                </View>

                {/* Driver Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>👤 Driver</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>🚗 Name:</Text>
                        <Text style={styles.value}>{rideDetails.driver.name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>🚘 Vehicle:</Text>
                        <Text style={styles.value}>{rideDetails.vehicleType}</Text>
                    </View>
                </View>

                {/* Booking Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📝 Booking Summary</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>💰 Price:</Text>
                        <Text style={styles.price}>₹{rideDetails.price}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>📌 Status:</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>✅ {booking.status.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* Go to Home Button */}
                <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.homeButtonText}>🏠 Go to Home</Text>
                </TouchableOpacity>
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
    safeArea: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#444",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    detailBlock: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#666",
    },
    value: {
        fontSize: 14,
        color: "#222",
        textAlign: "left",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007AFF",
    },
    statusBadge: {
        backgroundColor: "#4CAF50",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    statusText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    homeButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 15,
    },
    homeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default BookingConfirmationScreen;