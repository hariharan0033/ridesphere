import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BookRideScreen from "../screens/BookRideScreen";
import LocationSelectionScreen from "../screens/LocationSelectionScreen";
import RideDetailsScreen from "../screens/RideDetailsScreen";
import BookingConfirmationScreen from "../screens/BookingConfirmationScreen";

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BookRide" component={BookRideScreen} />
        <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
        <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
);

export default HomeStackNavigator;
