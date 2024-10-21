import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { colors } from "../config/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import Separator from "../components/Separator";
import Cell from "../components/Cell";
import { auth, database } from '../config/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const News = ({ navigation, route }) => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
    <Image
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
    >{route.params.broadcast?.date ? route.params.broadcast?.date.toLocaleDateString : 'Date Unknown'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    flexDirection: 'column',
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