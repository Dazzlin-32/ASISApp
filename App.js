
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from './screens/Chat';
import { createContext, useState, useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import General from './screens/General';
import News from "./screens/News";
import About from "./screens/About";
import Help from "./screens/Help";
import { colors } from './config/constants';
import { ChatHeader } from './components/ChatHeader';
import Landing from './screens/Landing';
import CameraCom from './screens/CameraCom';
import uuid from 'react-native-uuid';
import BadgeIcon from './components/BadgeIcon';
import Test from './screens/Test';
import NewsList from './screens/NewsList';
import { PaperProvider } from 'react-native-paper';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export const ImportantContext = createContext({});






 const ImportantContextProvider = ({children}) =>{
  const [badge, setBadge] = useState()
  const [chatID, setChatId] = useState(null)

  useEffect ( ()=>{
    setChatId(uuid.v4())
  // getChatID()
  // getStoredUniqueId()
  }, [])


  return (
    <ImportantContext.Provider  value={{ badge, setBadge, chatID, setChatId }} >
      {children}
    </ImportantContext.Provider>
  )
}



const TabNavigation = () => (

  <Tab.Navigator
  screenOptions={({ route }) => ({
    // tabBarIcon: ({ focused, color, size }) => {
    //   let iconName;
    //   let badgeCount = 0; // Default badge count

    //   if (route.name === 'Main') {
    //     iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
    //     badgeCount = 0; // no badge count for Main
    //   } else if (route.name === 'News') {
    //     iconName = focused ? 'newspaper' : 'newspaper-outline';
    //     badgeCount = 5; // badge for General
    //   }
    //   else if (route.name === 'Information') {
    //     iconName = focused ? 'information-circle' : 'information-circle-outline';
    //     badgeCount = 0; // badge for General
    //   }

    //   return <BadgeIcon iconName={iconName} badgeCount={badgeCount} size={size} color={color} />;
    // },
  })}
  > 
   
    <Tab.Screen name="News" 
     component={NewsList} 
     options={ { 
      header: (props) => <ChatHeader 
      titleOne='AFAR PEACE AND SECURITY'
      subtitle='News' />
               }}/>
     <Tab.Screen 
     name="Main" component={Test} 
     options={ { 
       header: (props) => <ChatHeader 
       titleOne='AFAR PEACE AND SECURITY'
       subtitle='Online' />
                }} />
     <Tab.Screen name="Information" component={General} 
     
    tabBarBadge = "1"
    options={ { 
      header: (props) => <ChatHeader 
      titleOne='AFAR PEACE AND SECURITY'
      subtitle='Information' />
               }} />
</Tab.Navigator>

)


const MainStack = () => (
  <Stack.Navigator >
    <Stack.Screen name='Landing' component={Landing}  options={ {headerShown: false}}/>
    <Stack.Screen name='Home' component={TabNavigation}   options={{ headerShown: false }} />
    <Stack.Screen name='Camera' component={CameraCom}  options={ {headerShown: false}}/>
    <Stack.Screen name="News Detail" 
     options={ {
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
      
    }}
    component={News} />
    <Stack.Screen name="About" component={About} 
     options={ { 
      header: (props) => <ChatHeader 
      titleOne='AFAR PEACE AND SECURITY'
      subtitle='About Us' />
               }}
     />
    <Stack.Screen name="Help" component={Help} />
  </Stack.Navigator>

)


export default function App() {
  
  return (
    <PaperProvider >
    <ImportantContextProvider>
      <NavigationContainer>
        <MainStack />
  
      </NavigationContainer>
    </ImportantContextProvider>
  </PaperProvider>
   
  );
}


