import React, { useCallback, useEffect, useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import {  Card, Text } from 'react-native-paper';

import ContactRow from "../components/ContactRow";
import { colors } from "../config/constants";
//import Cell from "../components/Cell";
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';
import { ImportantContext} from '../App';

const NewsList = ({ navigation }) => {


    const context = useContext(ImportantContext)
    const [broadcasts, setBroadcasts] = useState([])
    const [oldBroadcastsLength, setOldBroadCastsLength] = useState()
    const [waiting, setWaiting] = useState(false)

    useEffect(  ()=>{

        setOldBroadCastsLength(broadcasts.length)
        
        const unsubscribe = async () => {

            const collectionRef = collection(database, 'broadcast')
            const querySnapshot = await getDocs(collectionRef)
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));

            // console.log(documents)
            setBroadcasts(documents)
            
            if(broadcasts.length > 0 ) setWaiting(true)
            if(broadcasts.length > oldBroadcastsLength) {
                context.setBadge(broadcasts.length - oldBroadcastsLength)
            }
            
        }
        unsubscribe()

       

    }, [broadcasts])
    


    return (
        <View>
            <ScrollView style={styles.container} >
              
                {
                    waiting && broadcasts.map( (broadcast, index) => (
                    <React.Fragment key={index} >
                     {/* <ContactRow
                        name ={broadcast.title}
                        subtitle={broadcast.description?.slice(0,125)}
                        imageUrl = {broadcast.imageUrl}
                        style={styles.contactRow}
                        onPress={() => {
                            navigation.navigate('News Detail', {
                               broadcast: broadcast
                            });
                        }}
                        /> */}
                    <TouchableOpacity
                    
                     onPress={() => {
                        navigation.navigate('News Detail', {
                           broadcast: broadcast
                        });
                    }}>
                        <Card style={styles.contactRow}>
                            <Card.Content>
                                <Card.Cover source={broadcast.imageUrl}/>
                                <Text variant="titleLarge">{broadcast.title}</Text>
                                <Text variant="bodyMedium">{broadcast.description?.slice(0,125)}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                    </React.Fragment>       
                     ))  
                }
                {
                    !waiting && 
                    <Text>Loading ... </Text>
                }
                

            </ScrollView>

            <TouchableOpacity style={styles.somestyles}>
                <Image 
                style={styles.logoImage}
                source={require('../assets/images/roundlogo.png')}/>
                <Text style={styles.title}>AFAR PEACE & PRIVACY ISSUES REPORTING APP </Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingRi: 10,
    },
    contactRow: {
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.primary,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    somestyles: {
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
    logoImage : {
        height:50,
        width: 50,
        margin: 5,
    }
})

export default NewsList;
