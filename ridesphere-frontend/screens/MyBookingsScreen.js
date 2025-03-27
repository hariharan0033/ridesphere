import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { api } from "../services/api";
import { capitalize } from "../utils/capitalize";

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/rides/my-bookings");

      const currentTime = new Date();
      const upcomingBookings = response.data.filter(
        (ride) => new Date(ride.dateTime) > currentTime
      );
      setBookings(upcomingBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = useCallback(() => {
    fetchBookings();
  }, []);

  const handleContactDriver = (mobileNumber) => {
    if (mobileNumber) {
        Linking.openURL(`tel:+91${mobileNumber}`);
    } else {
      alert("Driver contact not available");
    }
  };

  const renderBooking = ({ item }) => {
    const rideDate = new Date(item.dateTime);
    const formattedDate = rideDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = rideDate.toLocaleTimeString("en-IN", {
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
            source={item.vehicleType === "car" ? require("../assets/Car.png") : require("../assets/Bike.png")}
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
            <FontAwesome5 name="money-bill-wave" size={14} color="#333" />
            <Text style={styles.infoText}>₹{item.price}</Text>
          </View>
        </View>

        <Text style={styles.boldText}>Driver:</Text>
        <Text style={styles.driverText}>
          {item.driverId?.name || "N/A"} - {item.driverId?.mobileNumber || "No contact"}
        </Text>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContactDriver(item.driverId?.mobileNumber)}
        >
          <Text style={styles.contactText}>Contact Driver</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBooking}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No upcoming bookings.</Text>}
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
  rideCard: {
    backgroundColor: "#E2F5ED",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#008955",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginLeft: 5,
  },
  vehicleImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  infosRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  driverText: {
    fontSize: 14,
    color: "#555",
  },
  contactButton: {
    backgroundColor: "#008955",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  contactText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});

export default MyBookingsScreen;
