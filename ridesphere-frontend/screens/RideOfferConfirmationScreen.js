import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const RideOfferConfirmationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      {/* Confirmation Badge */}
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#DFF5E4",
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#008955",
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>✔</Text>
        </View>
      </View>

      {/* Confirmation Message */}
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>Ride Listed Successfully!</Text>
      <Text style={{ fontSize: 16, color: "#666", textAlign: "center", marginTop: 5, paddingHorizontal: 40 }}>
        Ride is now available for passengers to book.
      </Text>

      {/* Navigate to Home Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#008955",
          paddingVertical: 15,
          paddingHorizontal: 90,
          borderRadius: 10,
          marginTop: 30,
          position: "absolute",
          bottom: 90,
        }}
        onPress={() => {navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
      });
      }}
      >
        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RideOfferConfirmationScreen;
