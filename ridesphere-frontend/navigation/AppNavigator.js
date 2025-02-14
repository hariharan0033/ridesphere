import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

const AppNavigator = () => {
    const { token } = useSelector((state) => state.auth);

    return (
        <NavigationContainer>
            {token ? <BottomTabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
