import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    StatusBar,
    Platform,
} from "react-native";
import { api } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");  // Added mobile number
    const [upiId, setUpiId] = useState("");  // Added UPI ID
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Added confirm password
    const [secureText, setSecureText] = useState(true);


    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validateMobileNumber = (mobile) => /^[6-9]\d{9}$/.test(mobile);

    const handleSignup = async () => {
        if (!name || !email || !mobileNumber  || !password || !confirmPassword) {
            return Alert.alert("Error", "All fields are required");
        }

        if (!validateEmail(email)) {
            return Alert.alert("Error", "Enter a valid email address");
        }

        if (!validateMobileNumber(mobileNumber)) {
            return Alert.alert("Error", "Enter a valid 10-digit mobile number");
        }

        if (password !== confirmPassword) {
            return Alert.alert("Error", "Passwords do not match!");
        }
        
        try {
            await api.post("/users/register", { name, email, mobileNumber, upiId, password });
            Alert.alert("Success", "Registration Successful!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Create an Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#d0d0d0"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#d0d0d0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#d0d0d0"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                />

                {/* <TextInput
                    style={styles.input}
                    placeholder="UPI ID"
                    placeholderTextColor="#d0d0d0"
                    value={upiId}
                    onChangeText={setUpiId}
                    autoCapitalize="none"
                /> */}

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter Your Password"
                        placeholderTextColor="#d0d0d0"
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        <FontAwesome name={secureText ? "eye-slash" : "eye"} size={20} color="#414141" />
                    </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#d0d0d0"
                        secureTextEntry={secureText}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        <FontAwesome name={secureText ? "eye-slash" : "eye"} size={20} color="#414141" />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.alreadyHaveAccount}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginText}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#414141",
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#b8b8b8",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    passwordContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#b8b8b8",
        borderRadius: 8,
        alignItems: "center",
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        height: "100%",
    },
    bottomContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 30,
    },
    signupButton: {
        backgroundColor: "#008955",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        height: 54,
    },
    signupButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    alreadyHaveAccount: {
        color: "#5a5a5a",
        fontSize: 14,
    },
    loginText: {
        color: "#008955",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default SignupScreen;
