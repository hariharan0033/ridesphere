import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const HomeScreen = ({ navigation }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {user?.name || "User"}! 👋</Text>
            <Button title="🚗 Offer a Ride" onPress={() => navigation.navigate("LocationSelection")} />
            <Button title="🎟 Book a Ride" onPress={() => navigation.navigate("BookRide")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default HomeScreen;
