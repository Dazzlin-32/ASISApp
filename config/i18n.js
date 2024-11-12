import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

// Import your translation files
import en from './en.json';
import am from './am.json';
// import af from './locales/af.json';


const resources = {
  en: { translation: en },
  am: { translation: am },
//   af: { translation: af },
};

i18n
  .use(initReactI18next) // Connects i18next with React
  .init({
    resources,
    lng: "en", // Set default language based on device locale
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;
