import { colors } from '../config/constants';
import Separator from "../components/Separator";
import Cell from "../components/Cell";
import { auth } from '../config/firebase';
import { BlurView } from 'expo-blur';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Image } from 'react-native';



const About = ({ navigation }) => {

 
    return (
        <View style={styles.container}>
           <BlurView intensity={10} style={styles.blurContainer}>
            <Image 
            style={styles.logo}
            source={require('../assets/images/symbol.png')}/>
          
            <Text style={styles.title}>AFAR PEACE AND SECURITY</Text>
          <Text style={styles.paragraph}>
          We are a dedicated ministry committed to promoting peace, security, 
          and stability in our communities. Through proactive initiatives,
           collaboration, and strategic interventions, we strive to foster
            harmonious relationships and safeguard the well-being of individuals 
            and societies. Our mission is to create a safer world for present and future generations.
         </Text>
         <Image 
            style={styles.logotwo}
            source={require('../assets/images/dagu.png')}/>
           </BlurView>
      </View>
  
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'fff',
    },

    blurContainer: {
      width: '100%',
        height:'100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    logo: {
      width: 150,
      height:150,
      margin: 5
    },

    title:{
      fontSize: 25,
      fontWeight: 'bold',
      color: colors.primary,
      width: 400,
      marginLeft: 60,
      marginTop: 10,
      marginBottom: 10,
    } ,
    paragraph: {
      fontSize: 18,
      textAlign: 'center',
      color: 'black',
    },
    logotwo : {
      height: 40,
      width: 40,
      margin: 10
    }
  });

export default About;
