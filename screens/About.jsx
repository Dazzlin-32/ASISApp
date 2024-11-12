import { colors } from '../config/constants';
import Separator from "../components/Separator";
import Cell from "../components/Cell";
import { auth } from '../config/firebase';
import { BlurView } from 'expo-blur';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View, StyleSheet, Image,  ImageBackground } from 'react-native';
import { Surface } from 'react-native-paper';



const About = ({ navigation }) => {

  
  const { t, i18n } = useTranslation();
  //i18n.changeLanguage("am");
    return (
        <View style={styles.container}>
           <BlurView intensity={10}>
           <ImageBackground 
            imageStyle={{opacity: 0.6,}}
            style= {{flex:1, justifyContent:"center", alignItems: 'center', resizeMode: 'contain',  zIndex: -1, 
                }}
            source={require('../assets/images/wallpaper1.jpg')}>
            <Surface style={styles.blurContainer}>
              <Image 
                style={styles.logo}
                source={require('../assets/images/symbol.png')}/>
              
                <Text style={styles.title}>{t('AFAR PEACE AND SECURITY')}</Text>
              <Text style={styles.paragraph}>
                {
                  t('AboutDetail')
                }
            
            </Text>

            <Image 
                style={styles.logotwo}
                source={require('../assets/images/dagu.png')}/>
            </Surface>

            </ImageBackground>
           </BlurView>
      </View>
  
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      //padding: 20,
      backgroundColor: 'fff',
    },

    blurContainer: {
      // width: '100%',
      //   height:'100%',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: colors.white,
    },
    logo: {
      width: 100,
      height:100,
      marginTop: 10,
    },

    title:{
      fontSize: 25,
      fontWeight: 'bold',
      color: colors.primary,
      marginTop:5,
      marginHorizontal: 10,
      backgroundColor: "#ffffffe5",  
      padding: 10,
    } ,
    paragraph: {
      fontSize: 18,
      textAlign: 'center',
      color: colors.primary,
      padding: 10,
      backgroundColor: "#ffffffe5",
      marginHorizontal: 20,
      borderRadius: 20
     
      
    },
    logotwo : {
      height: 60,
      width: 60,
      margin: 10
    }
  });

export default About;
