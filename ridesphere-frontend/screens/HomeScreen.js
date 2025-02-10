import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../redux/authSlice";

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        dispatch(logoutUser());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Ride Sharing</Text>
            <Button title="🚗 Offer a Ride" onPress={() => navigation.navigate("LocationSelection")} />
            <Button title="🎟 Book a Ride" onPress={() => navigation.navigate("BookRide")} />
            <Button title="🚪 Logout" onPress={handleLogout} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default HomeScreen;
