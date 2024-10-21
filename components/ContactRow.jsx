import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { colors } from '../config/constants';
import { Ionicons} from '@expo/vector-icons';


function ContactRow({ name, subtitle, onPress, style, onLongPress, selected, showForwardIcon = true, subtitle2 , imageUrl}) {
    return ( 
        <TouchableOpacity style={[styles.column, style]} onPress={onPress} onLongPress={onLongPress}>
            <View >
            <Image style={styles.avatar}
                src={imageUrl}>
            </Image>
        </View>
        

        <View style={styles.textsContainer}>
            <Text style={styles.name}>
                {name}
            </Text>
            <Text style={styles.subtitle}>
                {subtitle}
            </Text>
        </View>

        <View style={styles.textsContainer}>
            <Text style={styles.subtitle2}>
                {subtitle2}
            </Text>
        </View>
        <View>
            <Text>See more...</Text>
        </View>

        {/* {selected &&
            <View style={showForwardIcon ? styles.overlay : styles.overlay2}>
                <Ionicons name="checkmark-outline" size={16} color={'white'} />
            </View>
        }
        {showForwardIcon && <Ionicons name="chevron-forward-outline" size={20} />} */}

    </TouchableOpacity>
     );
}
const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    name: {
        fontSize: 24,
        marginLeft:55,
        marginTop: 10,
    },
    subtitle: {
        marginTop: 2,
        color: '#565656',
        width: 300,
    },
    subtitle2: {
        fontSize: 12,
        left: 96,
        color: '#565656',
    },
    textsContainer: {
        flex: 1,
        marginStart: 16
    },
    avatar: {
        width:250,
        height: 100,
        borderRadius: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 50
    },
    avatarLabel: {
        fontSize: 20,
        color: 'white'
    },
    overlay: {
        width: 22,
        height: 22,
        backgroundColor: colors.teal,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1.5,
        top: 18,
        right: 278
    },
    overlay2: {
        width: 22,
        height: 22,
        backgroundColor: colors.teal,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1.5,
        top: 18,
        right: 298
    },
})

export default ContactRow;