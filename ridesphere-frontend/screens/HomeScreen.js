import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const { user } = useSelector((state) => state.auth);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Top Bar with Menu & Notification Icons */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MaterialIcons name="menu" size={30} color="green" />
                </TouchableOpacity>
                <Text style={styles.title}>Welcome, {user?.name || "User"}! 👋</Text>
                <TouchableOpacity>
                    <MaterialIcons name="notifications-none" size={30} color="black" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.subtitle}>How can we assist you today?</Text>

                {/* Offer a Ride Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#008955" }]}
                    onPress={() => navigation.navigate("LocationSelection")}
                >
                    <MaterialIcons name="drive-eta" size={24} color="white" />
                    <Text style={styles.buttonText}>Offer a Ride</Text>
                </TouchableOpacity>

                {/* Book a Ride Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#007bff" }]}
                    onPress={() => navigation.navigate("BookRide")}
                >
                    <MaterialIcons name="directions-car" size={24} color="white" />
                    <Text style={styles.buttonText}>Book a Ride</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },

    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },

    title: { fontSize: 22, fontWeight: "bold", flex: 1, textAlign: "center" },

    content: { flex: 1, alignItems: "center", justifyContent: "center" },

    subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 30, color: "#333" },

    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginVertical: 10,
        width: "100%",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },

    buttonText: { color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
});

export default HomeScreen;
