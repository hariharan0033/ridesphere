import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import MyRidesScreen from "../screens/MyRidesScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
            name="Home" 
            component={HomeStackNavigator} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="home" size={size} color={color} />
                ),
            }} 
        />
        <Tab.Screen 
            name="My Rides" 
            component={MyRidesScreen} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="directions-car" size={size} color={color} />
                ),
            }} 
        />
        <Tab.Screen 
            name="My Bookings" 
            component={MyBookingsScreen} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="receipt" size={size} color={color} />
                ),
            }} 
        />
        <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="person" size={size} color={color} />
                ),
            }} 
        />
    </Tab.Navigator>
);

export default BottomTabNavigator;
