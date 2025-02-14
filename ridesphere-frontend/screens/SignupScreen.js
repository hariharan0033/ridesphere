import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { api } from "../services/api";

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        if (!name || !email || !password) {
            return Alert.alert("Error", "All fields are required");
        }

        try {
            await api.post("/auth/register", { name, email, password });
            Alert.alert("Success", "Registration Successful!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Title */}
                <Text style={styles.title}>Create an Account</Text>

                {/* Input Fields */}
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Signup Button */}
                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Navigation to Login */}
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    signupButton: {
        width: "100%",
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    signupButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginText: {
        marginTop: 15,
        fontSize: 14,
        color: "#666",
    },
    loginLink: {
        color: "#007AFF",
        fontWeight: "bold",
    },
});

export default SignupScreen;
