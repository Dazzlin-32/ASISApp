import React from "react";
import { Text, View, StyleSheet, TouchableOpacity,Image, ImageBackground  } from "react-native";
import { colors } from '../config/constants';
import { useTranslation } from "react-i18next";
import Cell from "../components/Cell";


const General = ({ navigation }) => {
    const {t} = useTranslation()


    return (
        <View style={styles.view}>
             <ImageBackground 
            imageStyle={{opacity: 0.6, height: 250, width: 280 , marginVertical: 300  }}
            style= {{flex:1, justifyContent:"flex-start", alignContent: 'center',  height: 490, resizeMode: 'cover',  zIndex: -1, 
                }}
            source={require('../assets/images/watermark.png')}>

                <Image 
                style={styles.logo}
                source={require('../assets/images/dagu.png')}/>
                <View style= {styles.secondCol}>
                <Cell
                    title={t('About Us')}
                    icon='key-outline'
                    onPress={() => {
                        navigation.navigate('About');
                    }}
                    iconColor="black"
                    style={styles.contactRow}
                />

                <Cell
                    title={t('Contact Us')}
                    icon='help-circle-outline'
                    iconColor="black"
                    onPress={() => {
                        navigation.navigate('Help');

                    }}
                    style={styles.contactRow}
                /> 
                </View>
            </ImageBackground>
         
           

        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:"space-around",
      
    },
    secondCol: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height:100,
        marginVertical: 20,
        marginHorizontal: 90,
      },  
    contactRow: {
        backgroundColor: 'white',
        width: 300,
        height: 50,
        //borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 10,
    },
    githubLink: {
        marginTop: 20,
        alignSelf: "center",
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 10,
        color: 'black', 
        margin : 1,
        width: 250,
      },
})

export default General;
