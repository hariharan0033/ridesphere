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
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../redux/authSlice";
import { api, setAuthToken } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "All fields are required");

        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user } = response.data;

            // Save token locally
            await AsyncStorage.setItem("token", token);
            setAuthToken(token);

            // Save user in Redux
            dispatch(setUser({ user, token }));

            Alert.alert("Success", "Login Successful!");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Login failed");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity> */}

                <Text style={styles.title}>Login with your email</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#d0d0d0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

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

                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.dontHaveAccount}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={styles.signUpText}> Sign Up</Text>
                    </TouchableOpacity>
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
    backText: {
        fontSize: 16,
        color: "#008955",
        marginVertical: 10,
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
    forgotPassword: {
        color: "#F44336",
        fontSize: 14,
        alignSelf: "flex-end",
        marginTop: 5,
    },
    bottomContainer: {
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: "#008955",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        height: 54,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    dontHaveAccount: {
        color: "#5a5a5a",
        fontSize: 14,
    },
    signUpText: {
        color: "#008955",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default LoginScreen;
