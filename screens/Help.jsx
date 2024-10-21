import React , {useState} from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Avatar, Card, IconButton } from 'react-native-paper';
import { Button, Snackbar } from 'react-native-paper';
import { colors } from "../config/constants";
import Separator from "../components/Separator";
import Cell from "../components/Cell";
import { auth } from '../config/firebase';

const Help = ({ navigation }) => {
    const phoneNumber = '+251911121314'

    const [visibleAbout, setVisibleAbout] = useState(false);

    const [visibleContact, setVisibleContact] = useState(false);

    const onToggleSnackBarAbout = () => setVisibleAbout(!visibleAbout);
  
    const onDismissSnackBarAbout = () => setVisibleAbout(false);

    const onToggleSnackBarContact = () => setVisibleContact(!visibleContact);
  
    const onDismissSnackBarContact = () => setVisibleContact(false);

    return (
        <View >
            <Button  
            style={styles.contactRow}
            onPress={onToggleSnackBarAbout}>
                <Card style={{backgroundColor: "white"}}>

                <Card.Title  style={{backgroundColor: "white"}}
                    title="About App"
                    // left={(props) => <Avatar.Icon {...props} icon="folder" />}
                    // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                />
                </Card>
            </Button>
            <Button  
            style={styles.contactRow}
            onPress={onToggleSnackBarContact}>
                <Card style={{backgroundColor: "white"}}>
                <Card.Title style={{backgroundColor: "white"}}
                    title="Contact Info"
                />
                </Card>
            </Button>
            <Image 
            style={styles.logotwo}
            source={require('../assets/images/dagu.png')}/>
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
        margin:120
      },
  
})

export default Help;
