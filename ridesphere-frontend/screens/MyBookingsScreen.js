import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyBookingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            <Text>Your booked rides will appear here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default MyBookingsScreen;
