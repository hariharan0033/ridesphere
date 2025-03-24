import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
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
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                {/* Profile Picture */}
                <View style={styles.profileHeader}>
                    <Image source={require("../assets/avatar.png")} style={styles.profileImage} />
                </View>

                {/* Name */}
                <Text style={styles.name}>{user?.name || "Nate Samson"}</Text>

                {/* Input Fields */}
                <TextInput style={styles.input} value={user?.email || "nate@email.com"} editable={false} />
                <View style={styles.row}>
                    <TextInput style={[styles.input, styles.phoneInput]} value={user?.mobileNumber || "9999888800"} editable={false} />
                </View>
                <TextInput style={styles.input} value={user?.gender || "Male"} editable={false} />
                <TextInput style={styles.input} value={user?.homeAddress || "Home Address"} editable={false} />
                <TextInput style={styles.input} value={user?.upiId || "UPI ID"} editable={false} />

                {/* Logout Button */}
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: "#fff" },
    container: { flex: 1, alignItems: "center", paddingHorizontal: 20, paddingTop: 30, justifyContent: "center" },

    profileHeader: { alignItems: "center", marginBottom: 15 },
    profileImage: { width: 138, height: 138, borderRadius: 60 },

    name: { fontSize: 34, fontWeight: "bold", marginBottom: 15, color: "#333" },

    input: { fontSize: 16, width: "100%", height: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, },

    row: { flexDirection: "row", alignItems: "center", width: "100%" },
    phoneInput: { flex: 1 },

    logoutButton: { width: "100%", height: 54, borderWidth: 1, borderColor: "#008955", borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 20 },
    logoutText: { color: "#008955", fontSize: 16, fontWeight: "bold" },
});

export default ProfileScreen;
