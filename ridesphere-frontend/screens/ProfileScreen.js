import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../redux/authSlice";

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        dispatch(logoutUser());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text>Name: {user?.name || "N/A"}</Text>
            <Text>Email: {user?.email || "N/A"}</Text>
            <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default ProfileScreen;
