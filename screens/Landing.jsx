import { TouchableOpacity , View, Text, Image, StyleSheet, ImageBackground ,  PermissionsAndroid, Alert, BackHandler}  from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import {colors} from   '../config/constants'
import Geolocation from '@react-native-community/geolocation';
import { Platform, Permissions } from 'react-native';
import { BlurView } from 'expo-blur';
import { database } from '../config/firebase';
import { collection, setDoc } from 'firebase/firestore';
import * as MediaLibrary from 'expo-media-library';
import { useTranslation } from 'react-i18next';

function Landing() {

    const navigation = useNavigation()
    const [errorMsg, setErrorMsg] = useState(null)
    const { t, i18n } = useTranslation(); //For translation
    const [location, setLocation] = useState(null);
    const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();


    //Read Sms
    const requestCameraPermission = async () => {

        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
              title: 'ASISApp Permission ',
              message:
                'ASIS App needs access to your camera ',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      };

      //Media Permission
      const handleRequestPermission = async () => {
        const { status } = await requestMediaLibraryPermission();
        if (status !== 'granted') {
          alert('Media Library permission is required to save pictures.');
        }
      };
    

    useEffect(() => {
        // const requestLocationPermission = async () => {
        //   if (Platform.OS === 'android') {
        //     try {
        //       const granted = await PermissionsAndroid.requestMultiple([
        //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        //       ]);
    
        //       if (granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED) {
        //         console.log("Result Granted")
        //         // Location permission granted - start watching position
        //         // const watchId = Geolocation.watchPosition(
        //         //   (position) => {
        //         //     setLocation(position.coords);
        //         //     console.log("Postion", position.coords.longitude)
        //         //   },
        //         //   (error) => {
        //         //     switch (error.code) {
        //         //       case 1:
        //         //         console.log("Permission Denied:", error.message);
        //         //         break;
        //         //       case 2:
        //         //         console.log("Position Unavailable:", error.message);
        //         //         break;
        //         //       case 3:
        //         //         console.log("Timeout:", error.message);
        //         //         break;
        //         //       default:
        //         //         console.log("Unknown error:", error.message);
        //         //     }
        //         //   },
        //         //   { enableHighAccuracy: true, timeout: 55000, maximumAge: 10000 }
        //         // );
    
        //         // return () => {
        //         //   Geolocation.clearWatch(watchId);
        //         // };
        //       } else {
        //         // Location permission denied - close the app
        //         Alert.alert(
        //           "Permission Required",
        //           "Location permission is required to use this app.",
        //           [{ text: "OK", onPress: () => BackHandler.exitApp() }]
        //         );
        //       }
        //     } catch (error) {
        //       console.error("Failed to request location permission", error);
        //     }
        //   }
        // };
    
        // requestLocationPermission();
        // handleRequestPermission();
        // requestCameraPermission();
        // console.log(location)
      }, []);

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
    // console.log("Location", location)

    // return () => {
    //     Geolocation.clearWatch(watchId);
    // };
    // }, []);
    
    const handleStart = async () => {
         
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
    
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

 
    // useEffect(() => {
    //     const requestLocationPermission = async () => {
    //       if (Platform.OS === 'android') {
    //         const granted = await Permissions.requestMultiple([Permissions.ANDROID.ACCESS_FINE_LOCATION, Permissions.ANDROID.ACCESS_COARSE_LOCATION]);
    //         if (granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
    //           // Location permission granted
    //           const watchId = Geolocation.watchPosition(
    //             (position) => {
    //             setLocation(position.coords);
    //             },
    //             (error) => {
    //                 switch (error.code) {
    //                     case 1:
    //                       console.log("Permission Denied:", error.message);
    //                       break;
    //                     case 2:
    //                       console.log("Position Unavailable:", error.message);
    //                       break;
    //                     case 3:
    //                       console.log("Timeout:", error.message);
    //                       break;
    //                     default:
    //                       console.log("Unknown error:", error.message);
    //                   }
    //             },
    //             {enableHighAccuracy: true, timeout: 55000, maximumAge: 10000},
        
               
    //         );
    //         console.log("Location", location)
    //         return () => {
    //             Geolocation.clearWatch(watchId);
    //         };
    //         } else {
    //           // Location permission denied
    //           const granted = await Permissions.requestMultiple([Permissions.ANDROID.ACCESS_FINE_LOCATION, Permissions.ANDROID.ACCESS_COARSE_LOCATION]);
    //         }
    //       }
    //     };
    //     requestLocationPermission();
    //   }, []);
    return ( 
    <View style={styles.container}>
        <View style= {styles.whiteSheet}>
        <ImageBackground style={styles.backImage}
        source={require('../assets/images/semera.jpeg')}
        >
        <BlurView intensity={50} style={styles.blurContainer}>
          <View style={styles.middleContainer}>
                <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
                />
                <Text style={styles.title}>{t("AFAR PEACE & SECURITY")}</Text>
                <Text style={styles.title}>{t("ISSUES REPORTING")}</Text>
                <Text style={styles.title}>{t("APP")}</Text>
                {/* <Text>{location}</Text> */}
                <TouchableOpacity style={styles.button}  onPress={handleStart}>
                        <Text style= {styles.whiteButton}>
                           { t("Get Started")}
                        </Text>
                </TouchableOpacity>
          </View>
            </BlurView>
        </ImageBackground>
        </View>
     
       
     
    
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
        backgroundColor: '#0033587c',
    },
    backImage: {
        width: '100%',
        height:'100%',
     
    },
    middleContainer : {
      margin: 20,
      alignItems: 'center',
      justifyContent: "center",
      width: '90%',
      height:'80%',
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
      margin: 3,
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
        width: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
  });