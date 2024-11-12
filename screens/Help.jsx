import React , {useState} from "react";
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native";
import { Avatar, Card, IconButton , Surface , Text} from 'react-native-paper';
import { Button, Snackbar } from 'react-native-paper';
import { colors } from '../config/constants';
import { useTranslation } from "react-i18next";
import Separator from "../components/Separator";
import Cell from "../components/Cell";
import { auth } from '../config/firebase';

const Help = ({ navigation }) => {
    const phoneNumber = '+251911121314'

    const {t} = useTranslation()

    const [visibleAbout, setVisibleAbout] = useState(false);

    const [visibleContact, setVisibleContact] = useState(false);

    const onToggleSnackBarAbout = () => setVisibleAbout(!visibleAbout);
  
    const onDismissSnackBarAbout = () => setVisibleAbout(false);

    const onToggleSnackBarContact = () => setVisibleContact(!visibleContact);
  
    const onDismissSnackBarContact = () => setVisibleContact(false);

    return (
        <View style={{alignContent:"center"}}>
          <ImageBackground 
          source={require('../assets/images/wallpaper1.jpg')}
          imageStyle={{opacity: 0.5, height: "100%", width: "100%" }}
            style= {{ width: "100%", height: "100%"}}
          >

            <View style={{flexDirection:'row',  padding: 15}}>

              <Surface style={styles.surface} elevation={2}>
                            <TouchableOpacity style={{width: 150, height: 100, padding:10, alignItems:'center', justifyContent:"center", alignItems: "center"}}
                                    onPress={onToggleSnackBarAbout}>
                                <Text style={{color:'white'}} variant="titleMedium"> {t("About App")} </Text>
                            </TouchableOpacity>
                    </Surface>
                <Surface style={styles.surface} elevation={2}>
                        <TouchableOpacity style={{width: 150, height: 100, padding:10, alignItems:'center', justifyContent:"center"}}
                                onPress={onToggleSnackBarContact}>
                            <Text style={{color:'white'}} variant="titleMedium">  {t("Contact Info")} </Text>
                        </TouchableOpacity>
                </Surface>
            </View>
              <Image 
              style={styles.logotwo}
              source={require('../assets/images/dagu.png')}
              />
        <Snackbar
          visible={visibleAbout}
          onDismiss={onDismissSnackBarAbout}
          action={{
            label: 'Close',
            onPress: () => {
              // Do something
            },
          }}>
          Version 1.0.0
        </Snackbar>

        <Snackbar
          visible={visibleContact}
          onDismiss={onDismissSnackBarContact}
          action={{
            label: 'Close',
            onPress: () => {
              // Do something
            },
          }}>
              Call +251932121314
        </Snackbar>
        
          </ImageBackground>

        </View>
    )
}

const styles = StyleSheet.create({
    contactRow: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 5,
        margin: 5
    },
    logotwo: {
        width: 150,
        height:150,
        margin:100
      },
    surface : {
      height: 100,
      width: 150,
      backgroundColor: colors.primary,
      borderRadius: 15,
      margin:10

    }
  
})

export default Help;
