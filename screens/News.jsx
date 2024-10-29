import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { colors } from '../config/constants';
import { Avatar, Button, Card, Text } from 'react-native-paper';
// import Icon from "react-native-vector-icons/FontAwesome";
// import Separator from "../components/Separator";
// import Cell from "../components/Cell";
// import { auth, database } from '../config/firebase';
// import { query, where, collection, getDocs } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';

const News = ({ navigation, route }) => {

  return (
    <ScrollView contentContainerStyle={styles.container}>

    <Card>
      <Card.Content>
        <Card.Cover source={route.params.broadcast?.imageUrl} />
        <Text variant="titleLarge">{route.params.broadcast?.title}</Text>
        <Text variant="bodyMedium">{route.params.broadcast?.description}</Text>
        <Text variant="labelSmall">{route.params.broadcast?.date ? route.params.broadcast?.date.toLocaleDateString : 'Date Unknown'}</Text>
      </Card.Content>
    </Card>
    {/* <Image
    style = {styles.image}
    src={route.params.broadcast?.imageUrl}
     
    /> 
    <Text
     style={styles.title}
      >
      {route.params.broadcast?.title}</Text>
    <Text
     style={styles.description}
    >{route.params.broadcast?.description}</Text>

    <Text
     style={styles.date}
    >{route.params.broadcast?.date ? route.params.broadcast?.date.toLocaleDateString : 'Date Unknown'}</Text> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  
  image:{
    height: 200,
    width: 200,
    backgroundColor: colors.primary,
    marginLeft: 90,
    margin: 10,

  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 85,

  },
  description: {
    fontSize: 16,
    margin: 16,
  },
 
    
});

export default News;