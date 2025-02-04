import React from "react";
import { View, Button, StyleSheet } from "react-native";

const OfferRideScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Button title="Select Locations" onPress={() => navigation.navigate("LocationSelection")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default OfferRideScreen;
