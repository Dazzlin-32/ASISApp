import { TouchableOpacity , View, Text, Image, StyleSheet, ImageBackground} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import {colors} from   '../config/constants'
// import Geolocation from '@react-native-community/geolocation';
import { Platform, Permissions } from 'react-native';
import { BlurView } from 'expo-blur';
import { database } from '../config/firebase';
import { collection, setDoc } from 'firebase/firestore';

function Landing() {

    const navigation = useNavigation()
    const [errorMsg, setErrorMsg] = useState(null);
    // const [mLat, setMLat] = useState(0); //latitude position
    // const [mLong, setMLong] = useState(0); //longitude position

    // const getLocation = () => {
    //     Geolocation.getCurrentPosition(
    //       position => {
    //         console.log(position);
    //         setMLat(position.coords.latitude);
    //         setMLong(position.coords.longitude);
    //       },
    //       error => {
    //         // See error code charts below.
    //         console.log(error.code, error.message);
    //       },
    //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    //     );
    //     let location = await Location.getCurrentPositionAsync({
    //         accuracy: Location.Accuracy.BestForNavigation,
    //     });
    //   };
    
    const handleStart = async () => {
         
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        // Geolocation.getCurrentPosition(
        //     position => {
        //       console.log(position);
        //       setMLat(position.coords.latitude);
        //       setMLong(position.coords.longitude);
        //     },
        //     error => {
        //       // See error code charts below.
        //       console.log(error.code, error.message);
        //     },
        //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        //   );
       
        if(errorMsg)
            console.log("Error , ", errorMsg)
        navigation.navigate("Home",
            {
                screen: 'Main',
                params: { lng: "",
                          lat : ""
                 },
            }
        );
       
       
    }

    // const [location, setLocation] = useState(null);

    // useEffect(() => {
    // const watchId = Geolocation.watchPosition(
    //     (position) => {
    //     setLocation(position.coords);
    //     },
    //     (error) => {
    //     console.error(error);   

    //     },
    //     { enableHighAccuracy: true }
       
    // );

    // return () => {
    //     Geolocation.clearWatch(watchId);
    // };
    // }, []);
    // useEffect(() => {
    //     const requestLocationPermission = async () => {
    //       if (Platform.OS === 'android') {
    //         const granted = await Permissions.requestMultiple([Permissions.ANDROID.ACCESS_FINE_LOCATION, Permissions.ANDROID.ACCESS_COARSE_LOCATION]);
    //         if (granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
    //           // Location permission granted
    //         } else {
    //           // Location permission denied
    //         }
    //       }
    //     };
    //     requestLocationPermission();
    //   }, []);
    return ( 
    <View style={styles.container}>
        <SafeAreaView style= {styles.whiteSheet}>
        <ImageBackground style={styles.backImage}
        source={require('../assets/images/semera.jpeg')}
        >
        <BlurView intensity={50} style={styles.blurContainer}>
                <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
                />
                <Text style={styles.title}>AFAR PEACE & PRIVACY</Text>
                <Text style={styles.title}>ISSUES REPORTING</Text>
                <Text style={styles.title}>APP</Text>
                {/* <Text>{location}</Text> */}
                <TouchableOpacity style={styles.button}  onPress={handleStart}>
                        <Text style= {styles.whiteButton}>
                            Get Started
                        </Text>
                </TouchableOpacity>
            </BlurView>
        </ImageBackground>
        </SafeAreaView>
     
       
     
    
    </View>
     );
}

export default Landing;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        
    },
    
    whiteSheet: {
        width: '100%',
        height: '100%',
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 60, 
       
    },
    blurContainer: {
        width: '100%',
        height:'100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#0033587c',
    },
    backImage: {
        width: '100%',
        height:'100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    logo: {
      width: 250,
      height: 250,
      margin: 10
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white', 
      margin : 5
    },
    whiteButton : {
        color : 'white',
        fontWeight: 'bold',
        fontSize: 20

    },
    button: {
        backgroundColor: colors.primary,
        padding: 5,
        height: 58,
        width: 260,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
  });