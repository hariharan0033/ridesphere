import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const BookRideScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎟 Book a Ride</Text>
            <Text>Feature coming soon...</Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default BookRideScreen;
