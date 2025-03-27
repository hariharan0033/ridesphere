import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { api } from "../services/api";
import { capitalize } from "../utils/capitalize";

const MyRidesScreen = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch rides data
  const fetchRides = useCallback(async () => {
    try {
      const response = await api.get("/rides/my-rides");
      setRides(response.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch data only when the component mounts
  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  // Pull-to-refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchRides();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#008955" />
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No rides posted yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#008955"]} />
        }
        renderItem={({ item }) => {
          const istDate = new Date(item.dateTime);
          const formattedDate = istDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const formattedTime = istDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <View style={styles.rideCard}>
              <View style={styles.locationContainer}>
                <View style={{ flex: 1 }}>
                  <View style={styles.locationRow}>
                    <FontAwesome5 name="map-marker-alt" size={18} color="#008955" />
                    <Text style={styles.locationText}>{capitalize(item.pickupLocation.address)}</Text>
                  </View>
                  <MaterialIcons name="arrow-downward" size={18} color="#555" style={{ marginLeft: 10 }} />
                  <View style={styles.locationRow}>
                    <FontAwesome5 name="map-marker-alt" size={18} color="#008955" />
                    <Text style={styles.locationText}>{capitalize(item.dropoffLocation.address)}</Text>
                  </View>
                </View>
                <Image
                  source={
                    item.vehicleType === "car"
                      ? require("../assets/Car.png")
                      : require("../assets/Bike.png")
                  }
                  style={styles.vehicleImage}
                />
              </View>

              <View style={styles.infosRow}>
                <View style={styles.infoRow}>
                  <FontAwesome5 name="calendar-alt" size={14} color="#333" />
                  <Text style={styles.infoText}>{formattedDate}</Text>
                </View>

                <View style={styles.infoRow}>
                  <FontAwesome5 name="clock" size={14} color="#333" />
                  <Text style={styles.infoText}>{formattedTime}</Text>
                </View>

                <View style={styles.infoRow}>
                  <FontAwesome5 name="chair" size={14} color="#333" />
                  <Text style={styles.infoText}>{item.availableSeats} Seats</Text>
                </View>
              </View>

              <Text style={styles.boldText}>Booked Riders:</Text>
              {item.vehicleType === "car" ? (
                Array.isArray(item.bookedRiders) && item.bookedRiders.length > 0 ? (
                  item.bookedRiders.map((rider, index) => (
                    <Text key={rider._id || index} style={styles.riderText}>
                      {rider.name} - {rider.mobileNumber}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.riderText}>No riders booked yet</Text>
                )
              ) : item.vehicleType === "bike" ? (
                item.bookedRiders && item.bookedRiders._id ? (
                  <Text style={styles.riderText}>
                    {item.bookedRiders.name} - {item.bookedRiders.mobileNumber}
                  </Text>
                ) : (
                  <Text style={styles.riderText}>No rider booked yet</Text>
                )
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff", 
    marginBottom: 65,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, 
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { fontSize: 18, textAlign: "center", marginTop: 20 },
  rideCard: {
    backgroundColor: "#E2F5ED",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#008955",
  },
  locationContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationText: { fontSize: 18, fontWeight: "bold", color: "#555", marginLeft: 5 },
  vehicleImage: { width: 50, height: 50, borderRadius: 8 },
  infosRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoText: { fontSize: 14, color: "#333", marginLeft: 5 },
  boldText: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  riderText: { fontSize: 14, color: "#555" },
});

export default MyRidesScreen;
