import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const VehicleSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pickupLocation, dropoffLocation, distance } = route.params; // Receive location data

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicles = [
    { id: "car", name: "Car", icon: require("../assets/Car.png") },
    { id: "bike", name: "Bike", icon: require("../assets/Bike.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Select Your Vehicle</Text>

      {/* Vehicle Options */}
      <View style={styles.grid}>
        {vehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleBox,
              selectedVehicle === vehicle.id && styles.selectedBox,
            ]}
            onPress={() => setSelectedVehicle(vehicle.id)}
          >
            <Image source={vehicle.icon} style={styles.vehicleIcon} />
            <Text style={styles.vehicleText}>{vehicle.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Proceed Button (Bottom Aligned) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={[styles.proceedButton, !selectedVehicle && styles.disabledButton]}
        onPress={() =>
            navigation.navigate("RideDetails", {
                pickupLocation, // { address, coordinates }
                dropoffLocation, // { address, coordinates }
                vehicleType: selectedVehicle, // "bike" or "car"
                distance, // Numeric value
            })
        }
        disabled={!selectedVehicle}
    >
        <Text style={styles.proceedText}>Proceed</Text>
    </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  vehicleBox: {
    width: 130,
    height: 130,
    backgroundColor: "#E0F2E9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: "#008955",
    backgroundColor: "#C8E6C9",
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20, // Ensures it stays above the bottom tab navigator
    left: 20,
    right: 20,
  },
  proceedButton: {
    backgroundColor: "#008955",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 70,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  proceedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VehicleSelectionScreen;
