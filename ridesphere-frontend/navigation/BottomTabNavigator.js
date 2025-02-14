import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import MyRidesScreen from "../screens/MyRidesScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const CustomTabLabel = ({ focused, label }) => (
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
);

const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabItem,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: "#008955",  // Green for active tab
            tabBarInactiveTintColor: "#414141", // Dark gray for inactive tab
        }}
    >
        <Tab.Screen 
            name="Home" 
            component={HomeStackNavigator} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="home" size={24} color={color} />
                ),
                tabBarLabel: ({ focused }) => <CustomTabLabel focused={focused} label="Home" />,
            }} 
        />
        <Tab.Screen 
            name="My Rides" 
            component={MyRidesScreen} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="directions-car" size={24} color={color} />
                ),
                tabBarLabel: ({ focused }) => <CustomTabLabel focused={focused} label="My Rides" />,
            }} 
        />
        <Tab.Screen 
            name="My Bookings" 
            component={MyBookingsScreen} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="receipt" size={24} color={color} />
                ),
                tabBarLabel: ({ focused }) => <CustomTabLabel focused={focused} label="My Bookings" />,
            }} 
        />
        <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="person" size={24} color={color} />
                ),
                tabBarLabel: ({ focused }) => <CustomTabLabel focused={focused} label="Profile" />,
            }} 
        />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,  // Adjust height
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: -2 },
    },
    tabItem: {
        paddingVertical: 10,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight : "400",
        color: "#414141",
    },
    tabLabelFocused: {
        color: "#008955",
    },
});

export default BottomTabNavigator;
