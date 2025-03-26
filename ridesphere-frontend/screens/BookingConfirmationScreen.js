import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView ,StatusBar,Platform} from 'react-native';
import { useNavigation } from "@react-navigation/native";

const BookingConfirmationScreen = ({ route }) => {

    const { rideDetails } = route.params; // Access rideDetails from route.params
    const navigation = useNavigation();


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Booking Summary</Text>
                <Text style={styles.rating}>{rideDetails.driverId.name}</Text>
                <Image source={rideDetails.vehicleType === 'car' ? require('../assets/Car.png') : require('../assets/Bike.png')}  style={styles.carImage} />
                
                <View style={styles.featuresContainer}>
                <Text style={styles.sectionTitle}>Ride Details : </Text>
                <View style={styles.featureBox}>
                    <Text style={styles.featureLabel}>Pickup Location</Text>
                    <Text style={styles.featureValue}>{rideDetails.pickupLocation.address}</Text>
                    </View>

                    <View style={styles.featureBox}>
                    <Text style={styles.featureLabel}>Dropoff Location</Text>
                    <Text style={styles.featureValue}>{rideDetails.dropoffLocation.address}</Text>
                    </View>

                    <View style={styles.featureBox}>
                    <Text style={styles.featureLabel}>Distance</Text>
                    <Text style={styles.featureValue}>{rideDetails.distance} km</Text>
                    </View>

                    <View style={styles.featureBox}>
                    <Text style={styles.featureLabel}>Date</Text>
                    <Text style={styles.featureValue}>{new Date(rideDetails.dateTime).toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.featureBox}>
                    <Text style={styles.featureLabel}>Time</Text>
                    <Text style={styles.featureValue}>{new Date(rideDetails.dateTime).toLocaleTimeString()}</Text>
                    </View>

                    <View style={styles.featureBox}>
                    <Text style={styles.featureLabel}>Price</Text>
                    <Text style={styles.featureValue}>₹{rideDetails.price}</Text>
                    </View>


                </View>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.rideNowButton} onPress={() => navigation.navigate("Home")}>
                        <Text style={{fontSize: 16, color: 'white' ,fontWeight:'bold'}}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, },
    container: {flex:1, padding: 20, backgroundColor: 'white' ,justifyContent: 'space-between',paddingBottom:85},
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'left',color:'#008955' },
    rating: { fontSize: 20, textAlign: 'center', color: 'gray' ,fontWeight:'bold'},
    carImage: { width: '100%', height: 150, resizeMode: 'contain' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    specsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    specBox: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 10, textAlign: 'center', alignItems: 'center', margin: 5 },
    featuresContainer: { marginTop: 10 },
    featureBox: { padding: 15, borderWidth: 1, borderRadius: 10, marginVertical: 5,backgroundColor: "#E2F5ED", borderColor: "#008955",fontSize:16, justifyContent: 'space-between', flexDirection: 'row' },
    featureLabel :{fontSize:16,fontWeight:'bold',color:'#008955'},
    featureValue :{fontSize:16},
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    rideNowButton: { padding: 15, backgroundColor: '#008955', borderRadius: 10, flex: 1, alignItems: 'center' },

});

export default BookingConfirmationScreen;
