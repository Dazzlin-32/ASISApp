import { useState, useRef , useEffect, useContext} from 'react';
import { ScrollView, StyleSheet,  Animated, Easing, View, TouchableOpacity, Modal, Image, Alert} from 'react-native';
import { Surface, Text ,Icon,  Button, TextInput} from 'react-native-paper';
import uuid from 'react-native-uuid';
import { colors } from '../config/constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios';
import { Audio, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import CameraCom from './CameraCom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { database ,storage} from '../config/firebase';
import { arrayUnion, doc, setDoc} from 'firebase/firestore';
import { ImportantContext } from '../App';
import Geolocation from '@react-native-community/geolocation';
import { useTheme } from '../App';



const GOOGLE_API_KEY = 'AIzaSyADC8vNOrfbGctE3a_xcwfHUBdjzg-_8vA'; 

function Test() {
  const [chatID, setChatId]= useState(uuid.v4())
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState();
  const [submittedMessages, setSubmittedMessages] = useState([]);
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  
  
  //const [loading, setLoading] = useState(null);
  const scrollViewRef = useRef();//To Scroll to bottom
  const context = useContext(ImportantContext)
  const { theme } = useTheme();

  //location update
  const getGoogleLocation = () => {
      console.log("get location")
      Geolocation.getCurrentPosition(
        position => {
          console.log(position.coords)
          location.latitude =  position.coords.latitude
          location.longitude = position.coords.latitude
        // location['latitude']= position.coords.latitude
        // location['longitude']= position.coords.longitude
        //console.log("LAtitude",  position.coords.latitude, " Longitude",  position.coords.longitude)
        console.log("Location: " ,location);
          
        },
        error => {
          switch (error.code) {
            case 1:
              console.log("Permission Denied:", error.message);
              break;
            case 2:
              console.log("Position Unavailable:", error.message);
              break;
            case 3:
              console.log("Timeout:", error.message);
              break;
            default:
              console.log("Unknown error:", error.message);
          }
        },
        {enableHighAccuracy: true, timeout: 65000, maximumAge: 10000,  distanceFilter: 0},
      );
  };
  //every 5 min
  useEffect(() => {
    const intervalId = setInterval(async() => {
      getGoogleLocation()
     // console.log("location")
    }, 1* 30 * 1000); // 1 hour minutes in milliseconds
    return () => clearInterval(intervalId);
    
  }, []); 

  //*********************Voice Recording and Sending*********************
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState();
  const [audio, setAudio] = useState()
  const [isPlaying, setIsPlaying] = useState(false);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    if (recording || isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.5,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    }
  }, [recording, isPlaying]);

  ///Start Record
  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {

        
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      //console.log('Recording started');
    } catch (err) {
      alert('Failed to start recording ', err);
    }
    }
  //Stop record
  async function stopRecording() {
      setRecording(undefined);
      console.log("Stoping record")

  await recording.stopAndUnloadAsync();
  let allRecordings = [...recordings];
  const { sound, status } = await recording.createNewLoadedSoundAsync();
  allRecordings.push({
    sound: sound,
    duration: getDurationFormatted(status.durationMillis),
    file: recording.getURI()
  });
 // console.log("Record", recording)

 function getDurationFormatted(milliseconds) {
  const minutes = milliseconds / 1000 / 60;
  const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
  return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
}
  setAudio(recording)
  console.log("Audio", audio)
  setRecordings(allRecordings);
    }

  //Showing Recorded Audio

  function clearRecordings() {
    setRecordings([])
  }
  
  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
              <TouchableOpacity style= {styles.button2}
                onPress={()=>{
                  handlePlay(recordingLine)
                }}
              >
                {
                  isPlaying ? <Ionicons
                  name="pause-outline"
                  size={25}
                  color={colors.primary} />: 
                  <Ionicons
                  name="play-outline"
                  size={25}
                  color={colors.primary} />
                }
                
              </TouchableOpacity>
              {/* {

        isPlaying && 
        <Animated.View
        style={{
          width: 10,
          height: 10,
          backgroundColor: 'green',
          borderRadius: 20,
          transform: [{ scale: pulseAnimation }],
        }}
      />} */}
          <MaterialCommunityIcons name="waveform" size={24} color= {colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
          <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
         

          <Button styles= {styles.buton} mode="contained" style={{backgroundColor:colors.primary, padding:0,margin:0}} labelStyle={{fontSize:10}} onPress={()=> {handleSendAudio(recordingLine)}} > {recordings.length > 0 ? 'Send' : ''}</Button>
          <Button styles= {styles.buton} mode="contained" style={{backgroundColor:colors.primary, padding:0,margin:0}} labelStyle={{fontSize:10}}  onPress={handleCancelAudio} > {recordings.length > 0 ? 'Cancel' : ''}</Button>
 
        </View>
      );
    });
  }

  //Playing Audio

  const handlePlay = ( recordingLine) =>{
    console.log("HandlePlay")

      if (isPlaying ) {
        console.log("Stopping")
        recordingLine.sound.stopAsync()
        setIsPlaying(false)
      } 
      else {
        console.log("Playing")
        recordingLine.sound.replayAsync()
      
        setIsPlaying(true)
          recordingLine.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }
  
      
    }
    const onPlaybackStatusUpdate = (status) => {
      
    (status.didJustFinish)?setIsPlaying(true) : ''
        //console.log("is playing dnesid just finish", isPlaying)

      
     // console.log("Did just finish: ", status.didJustFinish, "is playing, ", isPlaying)
      
    };


    //Sending Audio
  const handleSendAudio = async (recordingLine) => {
    setIsPlaying(false)
    recordingLine?.sound?.stopAsync()
    console.log("Sending Audio")
    const newMessages = 
    { id :  uuid.v4(),
      createdAt: new Date(),
      user : 'Anonymous',
      sent: "Sent",
      audio: recordingLine.file,
      }
      
    setMessages((prevMsgs) => [...prevMsgs, newMessages])
    console.log(messages)
    // Clear the input field
    clearRecordings()
        
      }

  const handleCancelAudio =() => {
    clearRecordings()
    console.log("Canceled Successfully")
  }

  const handlefirebaseAudioPlay = async(url) =>{
    if(!isPlaying) {
      const { sound , status} = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true } // Auto-play when loaded
      );
      
      setSound(sound);
      setIsPlaying(true);
      //const duration = getDurationFormatted(status?.durationMillis)
      console.log("Status", duration)
      await sound.playAsync();
      console.log('Playing audio');
    }
    else {
      console.log('Stopping audio');
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }

   //*********************Voice Recording and Sending Finished*********************

    //*********************Image Picking and Sending*********************
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          // aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled) {
          // await uploadImageAsync(result.assets[0]);
    //console.log("File", file)
        const newMessages = 
        { id :  uuid.v4(),
          createdAt: new Date(),
          user : 'Anonymous',
          sent: "Sent",
          image:result.assets[0].uri,
          }
          
        setMessages((prevMsgs) => [...prevMsgs, newMessages])
        console.log(messages)
          
      }
  };
  //change to blob file
 
    //*********************Image Picking and Sending Finished*********************

        //*********************Opening Camera and Video*********************
    const [modal, setModal] = useState(false); //to open modal

    function openModal() {
      if (modal) {
          setModal(false);
      } else {
         
          setModal(true);
      }
    }
    //OPEN IMAGE MODAL WHEN TOUCHED
  const [visible, setVisible] = useState(false); // Modal visibility state

  const handleImagePress = () => {
    setVisible(true); // Show modal when image is pressed
  };

  const closeModal = () => {
    setVisible(false); // Hide modal
  };

 

  const handleMessages = () => {
    const newMessages = 
      { id :  uuid.v4(),
        text : newMessage,
        createdAt: new Date(),
        user : 'Anonymous',
        sent: "Sent",
        location: [location.longitude, location.latitude]
        }
    setMessages((prevMsgs) => [...prevMsgs, newMessages])
    console.log(messages)
      // Clear the input field
      setNewMessage('');
  }

  const handleSubmit = () => {

    if( location.latitude === "" || location.longitude === "")
    {
      getGoogleLocation()
    }
    messages.map(
      (x)=> (
        x.image? 
        uploadImageAsync(x.image, x):
        x.audio?
        uploadAsyncAudio(x.audio, x):
        handleFirebaseSend(x)

      )
    )
    setSubmittedMessages((prevMsgs) => [...prevMsgs, messages])    
    setMessages([])
    //set new chat Id
    setChatId(uuid.v4())

    getGoogleLocation()
  }

 
  // Handle Image Upload to Firebase Storage

  async function uploadImageAsync(uri, message) {

    const response = await fetch(uri)
    const blob = await response.blob(); // Convert response to Blob
    console.log("Blob file of image: ", blob)

    try {
      console.log("Blob", blob.data.name)
      const fileRef = ref(storage, `newreports/${blob.data.name}`);
      const uploadTask = uploadBytesResumable(fileRef, blob);
      let downloadURL
      // uploadTask.on(
      //   'state_changed',
      //   () => {},
      //   (error) => {
      //     console.error('Upload failed:', error);
      //   },)
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progress updates (optional)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        }, 
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload failed:', error);
        }, 
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at:', downloadURL);
            downloadURL = downloadURL
            // You can now save this `downloadURL` to your Firestore or handle it as needed
            
            message['fileUrl'] = downloadURL
            message['fileType'] = blob.type
            message['filename'] = blob.data.name
            //console.log("--------", downloadURL)
            
            console.log("Image Sent to firebase Successfully")   
            handleFirebaseSend(message)
          });       
        },
        )
        
      }
      catch (e)
      {
        console.log(e)
        alert('Error encounterd while uploading File')

      }
}

  async function uploadAsyncAudio(uri, message) {
   
    const response = await fetch(uri);
    const blob = await response.blob(); // Convert response to Blob
    console.log("Blob of Audio")

    try {
      //const fileRef = ref(storage, `chats/${file.name}`);
      const storageRef = ref(storage, `newreports/${blob.data.name}`);
      let downloadURL
  
          // Upload the blob to Firebase storage    
            const uploadTask = uploadBytesResumable(storageRef, blob);
           
            uploadTask.on('state_changed', 
              (snapshot) => {
                // Progress updates (optional)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
              }, 
              (error) => {
                // Handle unsuccessful uploads
                console.error('Upload failed:', error);
              }, 
              () => {
                // Handle successful uploads
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  console.log('File available at:', downloadURL);
                  downloadURL = downloadURL
                  // You can now save this `downloadURL` to your Firestore or handle it as needed
                  message['audioUrl'] = downloadURL
                  //console.log("--------", downloadURL)
                  
                  console.log("Audio Sent to firebase Successfully")
                  handleFirebaseSend(message)
                });
              
              },
              () => {
                handleFirebaseSend(message)
              }
            )
    }
      catch (e)
      {
        console.log(e)
        alert('Error encounterd while uploading File', e)
      }
  }

  const handleFirebaseSend = async (message) => {
    console.log("Message",message)
    try {
      await setDoc(doc(database, 'newreports', chatID), {
        messages: arrayUnion(message),
        lastUpdated: Date.now(),
    },  { merge: true });
    }
    catch(e)
    {
      alert("Unable to send at the moment")
      console.log("Unable to send at the moment: ",e)
    }

    //Send all types of datas to firebase
  

  }

  return (  
    <>
     {/* Scroll View to show messages */}
      <ScrollView 
      contentContainerStyle={styles.scroll}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })} >
        {/* Loop through messages and show as a surface */}
        {
          submittedMessages.length > 0 &&
          submittedMessages.map (
            (y)=> (
              y.map(
                (x) => (
                  <View style={styles.bubble} key={x.index}>
                  {/* Text Message Rendering */}
                  {
                   
                    x.audio ?
                    <Surface style={styles.surface} elevation={2}>
                        <View  style={{flexDirection:"row", width:150}}>
                          <TouchableOpacity style= {{zIndex:3,}}
                                  onPress={()=>{
                                    handlefirebaseAudioPlay(x.audioUrl)
                                  }}
                                >
                                  {
                                    isPlaying ? <Ionicons
                                    name="pause-outline"
                                    size={25}
                                    color={colors.grey} />: 
                                    <Ionicons
                                    name="play-outline"
                                    size={25}
                                    color={colors.grey} />
                          }
                          </TouchableOpacity>
                            <MaterialCommunityIcons name="waveform" size={24} color= {colors.grey} />
                            <MaterialCommunityIcons name="waveform" size={24} color= {colors.grey} />
                            <MaterialCommunityIcons name="waveform" size={24} color= {colors.grey} />
                            <MaterialCommunityIcons name="waveform" size={24} color= {colors.grey} />
                            <MaterialCommunityIcons name="waveform" size={24} color= {colors.grey} />
                      </View>
                  </Surface>
                  :
                  x.image?
                  <View>
                      <TouchableOpacity 
                      onPress={handleImagePress}>
                        <Surface style={styles.surfaceImage} elevation={2}>
                                  <Image
                                source={{uri: x.fileUrl}} // Example image
                                style={styles.image}
                                resizeMode="cover" // Adjust how the image fits
                              />
                          <Text style={{color:'white', fontSize:10,}}>{x.createdAt.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}</Text>
                                            {/* {console.log(x.createdAt.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            }))} */}
                        </Surface>
                      </TouchableOpacity>
                      {/* Full-screen modal */}
                      <Modal
                        visible={visible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={closeModal} // Close modal on back button press (Android)
                      >
                        <View style={styles.modalContainer}>
                          <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
                            <Image
                              source={x.image} // Full-size image
                              style={styles.fullImage}
                              resizeMode="contain"
                            />
                            <Text style={styles.closeText}>Tap anywhere to close</Text>
                          </TouchableOpacity>
                        </View>
                      </Modal>
                  </View>

                 
                  :
                  <Surface style={styles.surface} elevation={4}>
                    <Text style={{color:'white', fontSize:16,}}>{x.text}</Text>
                    <Text style={{color:'white', fontSize:10,}}>{x.createdAt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</Text>
                                       {/* {console.log(x.createdAt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }))} */}
                  </Surface>
                  }
                  
                    
                  <Surface style={styles.avatar} elevation={4}>
                    <Text style={{color:'white', fontSize:10,}}>YOU</Text>
                    
                  </Surface>

                  {/* Audio Message Rendering */}
                 
              </View>
                )
                  
                
              )
              
              
          )
          )}
          {
            messages.length > 0 ?
            messages.map(
            (x)=> (
                <View style={styles.bubble} key={x.id}>
                    {/* Text Message Rendering */}
                    {
                      x.audio ?
                      <Surface style={styles.surface} elevation={4}>
                      <Text style={{color:'white', fontSize:16,}}>Audio</Text>
                      <Text style={{color:'white', fontSize:10,}}>{x.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</Text>
                                        {/* {console.log(x.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }))} */}
                    </Surface>
                    :
                    x.image?
                    <View>
                        <TouchableOpacity 
                        onPress={handleImagePress}>
                          <Surface style={styles.surface} elevation={4}>
                                    <Image
                                  source={x.image} // Example image
                                  style={styles.image}
                                  resizeMode="cover" // Adjust how the image fits
                                />
                            <Text style={{color:'white', fontSize:10,}}>{x.createdAt.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}</Text>
                                              {/* {console.log(x.createdAt.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              }))} */}
                          </Surface>
                        </TouchableOpacity>
                        {/* Full-screen modal */}
                        <Modal
                          visible={visible}
                          transparent={true}
                          animationType="fade"
                          onRequestClose={closeModal} // Close modal on back button press (Android)
                        >
                          <View style={styles.modalContainer}>
                            <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
                              <Image
                                source={x.image} // Full-size image
                                style={styles.fullImage}
                                resizeMode="contain"
                              />
                              <Text style={styles.closeText}>Tap anywhere to close</Text>
                            </TouchableOpacity>
                          </View>
                        </Modal>
                    </View>

                   
                    :
                    <Surface style={styles.surface} elevation={4}>
                      <Text style={{color:'white', fontSize:16,}}>{x.text}</Text>
                      <Text style={{color:'white', fontSize:10,}}>{x.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</Text>
                                        {/* {console.log(x.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }))} */}
                    </Surface>
                    }
                    
                      
                    <Surface style={styles.avatar} elevation={4}>
                      <Text style={{color:'white', fontSize:10,}}>YOU</Text>
                      
                    </Surface>

                    {/* Audio Message Rendering */}
                   
                </View>
                
            )
          )
          :
          <><Text style={{margin:10}}></Text></>

        }
      </ScrollView>

      {/* Message Input , Submit Button Camera Multimedia and Video  */}

      <View style={{flexDirection: 'column'}}>

        {/* show submit after message is written or voice or pic or video */}
        {
           messages.length > 0 &&
           <Button  
           onPress={handleSubmit}
           textColor='white'
           mode="contained" style={{backgroundColor:colors.primary, margin:5,}} >
                Submit Report
           </Button>
        }

        {/* Show Voice Recordings for Sending or Canceling */}
        {getRecordingLines()}
                            {
                            recording && 
                            <View > 
                              <Animated.View
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: 'red',
                                borderRadius: 10,
                                transform: [{ scale: pulseAnimation }],
                            }}
                            />
                            </View>
                          

                            }
        <View style={{flexDirection: 'row'}}>

        <View  style={{marginHorizontal:6, width:310, borderRadius: 5, borderRadius:15, borderWidth:1, borderColor:colors.primary,  flexDirection: 'row',  alignItems: 'center', backgroundColor:colors.white , paddingHorizontal:5}}>
          <MaterialCommunityIcons name="camera-outline" size={24} color={colors.primary} onPress={openModal} />
          <TextInput
            placeholder="Type here"
            multiline ={true}
            style={{ flex: 1,paddingHorizontal: 10,backgroundColor:colors.white, color: colors.black}}
            onChangeText={setNewMessage}
            value={newMessage}
            selectionColor={colors.grey}
            cursorColor={colors.primary}
          />


          <MaterialCommunityIcons name="image-multiple-outline" size={24} color={theme.colors.primary} onPress={pickImage} />
        </View>

        {/* <TextInput
        style={{marginHorizontal:6, width:310, borderRadius: 5, borderRadius:30, borderWidth:0, borderColor:colors.border}}
        value={newMessage}
        onChangeText={setNewMessage}
        mode='outlined'
        contentStyle={styles.input}
        outlineColor= {colors.white}
        outlineStyle={{borderRadius: 20, borderColor:colors.primary}}
        left={<TextInput.Icon 
          onPress={openModal}
          icon="camera-outline" color= {colors.primary} styles={{backgroundColor: colors.white}}  />}
        right= {
                <TextInput.Icon icon="image-multiple-outline"  color={theme.colors.primary}
                 onPress={()=>{pickImage()}} />
                 }
        /> */}
        {
          newMessage?.length > 1 ?
          <Button 
         
          style={{width: 5,height:50, paddingLeft: 15,paddingVertical:6,backgroundColor:colors.primary, borderWidth: 0, borderRadius: 85}}
          icon={({ size, color }) => (
            <Ionicons name="send" size={25} color= {'white'} />
          )}
          mode="outlined" onPress={() =>handleMessages()}>
    </Button>
    :
        <Button style={{width: 5,height:50, paddingLeft: 15,paddingVertical:6,backgroundColor:colors.primary, borderWidth: 0, borderRadius: 85}}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="microphone-outline" size={25} color= {'white'} />
        )}
        mode="outlined" onPress={recording ? stopRecording : startRecording}>
      </Button>
        }
        </View>
        {modal &&
            <Modal 
            animationType="slide"
            transparent={false}>
              <CameraCom 
              style= {styles.cameraContainer}
              setModal = {setModal}
              lat = {location?.latitude}
              lng = {location?.longitude}
              length = {messages.length}
              setMessages={setMessages}
              messages={messages} />
            </Modal>
            }

      
      </View>
    </>
  );
}

export default Test;

const styles = StyleSheet.create({ 
  scroll: {
    flexDirection: 'column',
   alignItems: 'flex-end'
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center"

  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey
  },
  surface: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 18,
    // height: 80,
    // width: 250,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: colors.primary,
    borderRadius: 20
  },
  

  animationContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveLine: {
    width: 5,
    backgroundColor: 'red',
    borderRadius: 2.5,
  },
  row: {
    position:'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 5,
    width: 385,
    height: 65,
    backgroundColor: 'white',
    marginLeft: 2,
    zIndex: 2
  },
  surfaceImage: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding:2,
    // height: 80,
    // width: 250,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: "transparent",
    borderRadius: 20
  },
  image: {
    width: 150,
    height: 150,
     // Optional: Making the image circular
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark transparent background
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
  },
  closeText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
  input :{
    backgroundColor: colors.white
  }
})