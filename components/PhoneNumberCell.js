// PhoneNumberCustomCell.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../config/constants';
// import { PhoneCustom } from './PhoneCustom';
// phonecustom.js
export const PhoneCustom = (phoneNumber = '') => {
    // Remove any non-digit characters
    const cleanedNumber = (phoneNumber || '').replace(/\D/g, '');
  
    // Format the phone number
    // const areaCode = cleanedNumber.slice(0, 3);
    // const prefix = cleanedNumber.slice(3, 6);
    // const lineNumber = cleanedNumber.slice(6);
    // return `(${areaCode}) ${prefix}-${lineNumber}`;
  };
const PhoneNumberCell = ({
  title,
  icon,
  tintColor,
  value,
  
  onChangeText,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const PhoneNumberCell = PhoneCustom(value);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleUpdatePress = () => {
    onUpdate(value); // Call the onUpdate callback with the new phone number
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={icon} size={24} color={tintColor} />
        <View style={styles.titleText}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      {isEditing ? (
        <View style={styles.phoneNumberContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />
          <TouchableOpacity onPress={handleUpdatePress}>
            <Text style={styles.updateButton}>Update</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.phoneNumberContainer}>
          <Text style={styles.phoneNumber}>{PhoneNumberCell}</Text>
          <TouchableOpacity onPress={handleEditPress}>
            <Icon name="pencil" size={22} color={colors.gray} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... your styles
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    // borderColor: colors.gray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneNumber: {
    fontSize: 18,
    color: colors.black,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: colors.black,
    paddingVertical: 8,
  },
  updateButton: {
    fontSize: 16,
    color: colors.teal,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

export default PhoneNumberCell;