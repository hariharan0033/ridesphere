import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BookRideScreen from "../screens/BookRideScreen";
import LocationSelectionScreen from "../screens/LocationSelectionScreen";
import VehicleSelectionScreen from "../screens/VehicleSelectionScreen";
import RideDetailsScreen from "../screens/RideDetailsScreen";
import RideOfferConfirmationScreen from "../screens/RideOfferConfirmationScreen";
import BookingConfirmationScreen from "../screens/BookingConfirmationScreen";

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BookRide" component={BookRideScreen} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
        <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
        <Stack.Screen name="VehicleSelection" component={VehicleSelectionScreen} />
        <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
        <Stack.Screen name="RideOfferConfirmation" component={RideOfferConfirmationScreen} />
    </Stack.Navigator>
);

export default HomeStackNavigator;
