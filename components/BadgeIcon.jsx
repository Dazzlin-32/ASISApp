import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

export const BadgeIcon = ({ iconName, badgeCount, size, color }) => {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={iconName} size={size} color={color} />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});

// export default BadgeIcon;
