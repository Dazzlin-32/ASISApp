
import { Image, View, Text, StyleSheet } from 'react-native';
import { colors } from '../config/constants';
import { TouchableOpacity } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ChatHeader({navigation, titleOne, subtitle, }) {
 
  return (
    
      <View style={styles.header}>
          
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
        />
        <View  >
          <Text style={styles.title}>{titleOne}</Text>
          <Text style={styles.online}>{subtitle}</Text>
        </View>
        
      
      
      </View>
    
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
   paddingTop: 30,
   paddingLeft: 10,
   paddingRight:10,
  


  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  titleBox : {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItemsl: 'center'
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