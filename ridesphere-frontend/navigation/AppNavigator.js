import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import OfferRideScreen from "../screens/OfferRideScreen";
import BookRideScreen from "../screens/BookRideScreen";
import LocationSelectionScreen from "../screens/LocationSelectionScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { token } = useSelector((state) => state.auth); // Check if user is logged in

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {token ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="OfferRide" component={OfferRideScreen} />
                        <Stack.Screen name="BookRide" component={BookRideScreen} />
                        <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
