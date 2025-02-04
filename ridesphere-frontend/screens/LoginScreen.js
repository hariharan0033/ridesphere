import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../redux/authSlice";
import { api, setAuthToken } from "../services/api";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <View style={{ padding: 20 }}>
            <Text>Email:</Text>
            <TextInput style={{ borderWidth: 1, padding: 8 }} value={email} onChangeText={setEmail} />
            <Text>Password:</Text>
            <TextInput style={{ borderWidth: 1, padding: 8 }} secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Login" onPress={handleLogin} />
            <Text onPress={() => navigation.navigate("Signup")}>Don't have an account? Sign up</Text>
        </View>
    );
};

export default LoginScreen;
