import { DefaultTheme, DarkTheme } from 'react-native-paper';


export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.teal,
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    border: colors.border,
    error: colors.red,
    notification: colors.pink,
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    accent: colors.teal,
    background: '#121212',
    surface: '#333333',
    text: '#FFFFFF',
    border: colors.border,
    error: colors.red,
    notification: colors.pink,
  },
};
