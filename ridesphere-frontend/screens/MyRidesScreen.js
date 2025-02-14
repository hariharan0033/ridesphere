import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyRidesScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Rides</Text>
            <Text>Your posted rides will appear here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default MyRidesScreen;
