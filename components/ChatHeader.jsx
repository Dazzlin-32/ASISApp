
import { Image, View, Text, StyleSheet } from 'react-native';
import { colors } from '../config/constants';
import { SafeAreaView , useSafeAreaInsets} from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

export function ChatHeader({navigation, titleOne, subtitle, }) {
  const insets = useSafeAreaInsets(); 
  const { t} = useTranslation()

  return (
    
    <View style={[styles.header]}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
          />
          <View  >
            <Text style={styles.title}>{t(titleOne)}</Text>
            <Text style={styles.online}>{t(subtitle)}</Text>
          </View>
    </View>
//     <Appbar.Header>
//     <Appbar.Content title="Title" />
//      <Appbar.Action icon="magnify" onPress={() => {}} />
    
//  </Appbar.Header>
    
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomEndRadius:30,
    marginTop: 0,
    
    // paddingTop: 20,
    // paddingLeft: 10,
    // paddingRight:10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
 
  },
  titleBox : {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItemsl: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flexDirection: 'column',
   
    
  },
  online: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  
    
  },

});