import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../config/constants";
import { Ionicons } from '@expo/vector-icons'

const Cell = ({ title, icon, iconColor='white', tintColor, style, onPress, secondIcon, subtitle, showForwardIcon = true }) => {
    return (
        <TouchableOpacity style={[styles.cell, style]} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
                <Ionicons name={icon} size={18} marginStart={4} color={iconColor} />
            </View>

            <View style={styles.textsContainer}>
                <Text style={styles.title}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {showForwardIcon && <Ionicons name={secondIcon ?? 'chevron-forward-outline'} size={18} />}

        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    contactRow: {
        width: 200,
        backgroundColor: 'white',
        // marginTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: colors.primary,
    },
    cell: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    subtitle: {
        color: '#565656'
    },
    title: {
        fontSize: 14,
    },
    textsContainer: {
        flex: 1,
        marginStart: 8
    },
    iconContainer: {
        width: 24,
        height: 20,
        borderRadius: 6,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default Cell;



