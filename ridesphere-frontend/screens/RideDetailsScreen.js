import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "../services/api";
import { useEffect } from "react";
import { capitalize } from '../utils/capitalize';

const RideDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pickupLocation, dropoffLocation, vehicleType, distance } = route.params || {};

  useEffect(() => {
    if (!pickupLocation || !dropoffLocation || !vehicleType || distance === undefined) {
      Alert.alert("Error", "Missing ride details. Please go back and re-enter.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, []);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [availableSeats, setAvailableSeats] = useState("");
  const [isCustomPrice, setIsCustomPrice] = useState(false);
  const [price, setPrice] = useState((distance * 3).toFixed(2));
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: new Date(), 
        mode: currentMode,
        is24Hour: false,
        onChange: (_, selectedDate) => {
          if (selectedDate) {
            currentMode === "date" ? setDate(selectedDate) : setTime(selectedDate);
          }
        },
      });
    } else {
      setPickerMode(currentMode);
      setShowPicker(true);
    }
  };
  const handleCustomPrice = () => {
    setIsCustomPrice(true);
    setPrice(""); // Allow user to enter a new price
  };

  const handleAutoPrice = () => {
    setIsCustomPrice(false);
    setPrice((distance * 3).toFixed(2)); // Reset to calculated price
  };

  const handlePostRide = async () => {
    if (!date  || !time || !price || (vehicleType === "car" && !availableSeats)) {
      Alert.alert("Error", "Please fill all the required fields.");
      return;
    }
    if (vehicleType === "car" && (availableSeats === "" || Number(availableSeats) <= 0)) {
      Alert.alert("Error", "Please enter a valid number of available seats.");
      return;
    }

    setLoading(true);
    try {
      const rideDateTime = new Date(date);
      rideDateTime.setHours(time.getHours(), time.getMinutes());
  
      const rideData = {
        pickupLocation: {
          address: pickupLocation.address,
          coordinates: [pickupLocation.coordinates.longitude, pickupLocation.coordinates.latitude], // ✅ Fix: Convert to [lng, lat]
        },
        dropoffLocation: {
          address: dropoffLocation.address,
          coordinates: [dropoffLocation.coordinates.longitude, dropoffLocation.coordinates.latitude], // ✅ Fix: Convert to [lng, lat]
        },
        dateTime: rideDateTime.toISOString(), // Send date as ISO string
        vehicleType,
        availableSeats: vehicleType === "car" ? Number(availableSeats) : 1,
        distance,
        price: Number(price),
      };
      
  
      await api.post("/rides/post", rideData);
  
      Alert.alert("Success", "Ride posted successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "RideOfferConfirmation" }],
    });
    
    } catch (error) {
      console.error("Ride posting error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to post ride. Try again later.");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Post a Ride</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Pickup</Text>
        <Text style={styles.infoText}>{capitalize(pickupLocation.address)}</Text>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Drop-off</Text>
        <Text style={styles.infoText}>{capitalize(dropoffLocation.address)}</Text>
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.inputBoxSmall} onPress={() => showMode("date")}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.infoText}>
            {date ? date.toLocaleDateString("en-GB") : "Select Date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputBoxSmall} onPress={() => showMode("time")}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.infoText}>
            {time ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "Select Time"}
          </Text>
        </TouchableOpacity>
      </View>


      {/* iOS DateTimePicker (Visible only when triggered) */}
      {Platform.OS === "ios" && showPicker && (
        <DateTimePicker
          value={pickerMode === "date" ? date : time}
          mode={pickerMode}
          display="spinner"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              pickerMode === "date" ? setDate(selectedDate) : setTime(selectedDate);
            }
          }}
        />
      )}

      {vehicleType === "car" && (
        <View style={styles.inputBox}>
          <Text style={styles.label}>Available Seats</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of seats"
            keyboardType="numeric"
            value={availableSeats}
            onChangeText={(text) => {
              if (Number(text) > 6) {
                Alert.alert("Error", "Max 6 seats allowed.");
              } else {
                setAvailableSeats(text.replace(/[^0-9]/g, ""));
              }
            }}
          />
        </View>
      )}

      <View style={[styles.inputBox, styles.priceContainer]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ""))}
            editable={isCustomPrice}
            placeholder={isCustomPrice ? "Enter custom price" : ""}
          />
        </View>
        <TouchableOpacity style={styles.customPriceButton} onPress={isCustomPrice ? handleAutoPrice : handleCustomPrice}>
          <Text style={styles.customPriceButtonText} >
          {isCustomPrice ? "Set Default Price" : "Enter Custom Price"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Distance</Text>
        <Text style={styles.infoText}>{distance} km</Text>
      </View>

      <TouchableOpacity style={styles.postButton} onPress={handlePostRide} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.postButtonText}>Post Ride</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008955",
    textAlign: "center",
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    margin: 6,
    gap:10
  },
  inputBox: {
    backgroundColor: "#E0F2E9",
    padding: 15,
    borderRadius: 12,
    margin: 6,
  },
  inputBoxSmall: {
    backgroundColor: "#E0F2E9",
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008955",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  input: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#008955",
    paddingBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customPriceButton: {
    backgroundColor: "#008955",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  customPriceButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",

  },
  postButton: {
    backgroundColor: "#008955",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default RideDetailsScreen;
