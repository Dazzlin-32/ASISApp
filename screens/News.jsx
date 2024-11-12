import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity , ImageBackground} from "react-native";
import { colors } from '../config/constants';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const News = ({ route }) => {
  console.log(route.params)

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <ImageBackground 
       imageStyle={{height: 250, width: "100%" }}
       style={{ width: "100%", height: "100%",paddingTop:230}} src= {route.params.broadcast?.imageUrl}  >
        <ImageBackground 
          source={require('../assets/images/wallpaper1.jpg')}
          imageStyle={{opacity: 1, height: "100%", width: "100%", borderTopLeftRadius: 40, borderTopRightRadius: 40,}}
            style= {{ width: "100%", height: "100%", borderRadius: 90,}}
          >
           
          <ScrollView style={{padding:25, margin: 10}}>
          
            <View  style={styles.texts}>
            <Text style={[{color: colors.black}, styles.title]} variant="displaySmall">{route.params.broadcast?.title}</Text>
              <Text style={{color: colors.black}} variant="titleSmall">{route.params.broadcast?.description}</Text>
              <Text style={{color: colors.black}} variant="labelSmall">{route.params.broadcast?.date ? route.params.broadcast?.date.toLocaleDateString : 'Date Unknown'}</Text>
              
            <Image 
                style={styles.logo}
                source={require('../assets/images/dagu.png')}/>
            </View>
          </ScrollView>
        </ImageBackground>
            

      </ImageBackground>
    {/* <Card style={{backgroundColor: colors.white}}>
      <Card.Content>
        <Card.Cover source={{uri : route.params.broadcast?.imageUrl}}   style= {{marginBottom: 15}} />
        <Text style={{color: colors.black}} variant="titleLarge">{route.params.broadcast?.title}</Text>
        <Text style={{color: colors.black}} variant="bodyMedium">{route.params.broadcast?.description}</Text>
        <Text style={{color: colors.black}} variant="labelSmall">{route.params.broadcast?.date ? route.params.broadcast?.date.toLocaleDateString : 'Date Unknown'}</Text>
      </Card.Content>
    </Card>
     */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    flexDirection: 'column',
    alignItems: 'center'
    // paddingHorizontal: 20,
    // paddingVertical: 10,
  },
  texts : {
    marginVertical: 5,
    padding: 10,
    //backgroundColor: colors.white,
  
    alignItems: 'center',
    backgroundColor:"#ffffffb4",


  },
  
  image:{
    height: 200,
    width: 200,
    backgroundColor: colors.primary,
    marginLeft: 90,
    margin: 10,

  },
  title: {
    marginVertical: 15,

  },
  description: {
    fontSize: 16,
    margin: 16,
    padding: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
    
});

export default News;