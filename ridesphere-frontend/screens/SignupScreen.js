import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { api } from "../services/api";

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        if (!name || !email || !password) return Alert.alert("Error", "All fields are required");

        try {
            await api.post("/auth/register", { name, email, password });
            Alert.alert("Success", "Registration Successful!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Name:</Text>
            <TextInput style={{ borderWidth: 1, padding: 8 }} value={name} onChangeText={setName} />
            <Text>Email:</Text>
            <TextInput style={{ borderWidth: 1, padding: 8 }} value={email} onChangeText={setEmail} />
            <Text>Password:</Text>
            <TextInput style={{ borderWidth: 1, padding: 8 }} secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Sign Up" onPress={handleSignup} />
            <Text onPress={() => navigation.navigate("Login")}>Already have an account? Login</Text>
        </View>
    );
};

export default SignupScreen;
