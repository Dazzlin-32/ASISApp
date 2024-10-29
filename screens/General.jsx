import React from "react";
import { Text, View, StyleSheet, TouchableOpacity,Image  } from "react-native";
import { colors } from '../config/constants';
import Cell from "../components/Cell";


const General = ({ navigation }) => {


    return (
        <View style={styles.view}>
             <Image 
            style={styles.logo}
            source={require('../assets/images/dagu.png')}/>
            <View style= {styles.secondCol}>
            <Cell
                title='About Us'
                icon='key-outline'
                onPress={() => {
                    navigation.navigate('About');
                }}
                iconColor="black"
                style={styles.contactRow}
            />

            <Cell
                title='Contact Us'
                icon='help-circle-outline'
                iconColor="black"
                onPress={() => {
                    navigation.navigate('Help');

                }}
                style={styles.contactRow}
               /> 
            </View>
         
            {/* <TouchableOpacity style={styles.githubLink}>
                <Text style={styles.title}>AFAR PEACE & PRIVACY ISSUES REPORTING APP </Text>
            </TouchableOpacity> */}

        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'fff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondCol: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 40
    },
    logo: {
        width: 100,
        height:100,
        margin: 30,
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
