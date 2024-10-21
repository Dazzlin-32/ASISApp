import React, { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, Keyboard, Text, ActivityIndicator,  Animated, Easing,Button, Modal } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat'
import { database ,storage} from '../config/firebase';
import { arrayUnion, doc, onSnapshot,setDoc, updateDoc} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { colors } from '../config/constants';
import { Audio, Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import CameraCom from './CameraCom';
import { ImportantContext} from '../App';

function Chat({route}) {

  //Import Context
    const context = useContext(ImportantContext)
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [sound, setSound] = useState();
    const [audio, setAudio] = useState()
    const videoRef = useRef(null); // for video preview
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [isPlaying, setIsPlaying] = useState(false);
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    //for media count
    const [photoCount, setPhotoCount] = useState(0);
    const [videoCount, setVideoCount] = useState(0);

    const [messages, setMessages] = useState([]);

    const [modal, setModal] = useState(false);
  
    //data to be Sent
    let data = {
      _id: '',
      createdAt: new Date(),
      received: false,
      sent: true,
      text: '',
      user : {
        _id: '',
        avatar: '',
        name : 'anonymous'      
      },
      type: 'report',
    }

    
    //const [context.chatID, context.setcontext.chatID] = useState();

    //Audio play and record animation
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
   

      //fetch sent messages
    useEffect(() => {
     try{
      const unsubscribe = onSnapshot(doc(database, 'newreports', context.chatID), (doc) => {
        if(doc.exists())
        {
          setMessages(doc.data().messages
              .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
              .map((message) => ({
                  _id: message._id,
                  createdAt: message.createdAt.toDate(),
                  text: message.text,
                  user: message.user,
                  sent: message.sent,
                  received: message.received,
                  audioUrl: message.audioUrl ?? '',
                  image: message.fileType?.startsWith('image/') ? message.fileUrl : '',
                  video: message.fileType?.startsWith('video/') ? message.fileUrl : '',
                  filename: message.filename,
              }))
          );
          //console.log(messages)
        }
    });

    return () => unsubscribe();
    }
    
     catch(e){
        alert("Error Fetching Data")
     }
       
    }, [context.chatID]);

    //fetch photo and video count
    // useEffect(()=>{

    //   const fetchMediaCount = async () => {
    //     try {
    //       // Request media library permission
    //       const { status } = await MediaLibrary.requestPermissionsAsync();
    //       if (status !== 'granted') {
    //         console.log('Permission denied');
    //         return;
    //       }
    
    //       // Fetch photos
    //       const photos = await MediaLibrary.getAssetsAsync({
    //         mediaType: 'photo',
    //         first: 100000, // Large number to fetch all items
    //       });
    //       console.log(photos)
    //       setPhotoCount(photos.totalCount);
    
    //       // Fetch videos
    //       const videos = await MediaLibrary.getAssetsAsync({
    //         mediaType: 'video',
    //         first: 100000, // Large number to fetch all items
    //       });
    //       setVideoCount(videos.totalCount);
    //       console.log("Photos Counted, ", photoCount, "  Videos Counted, ", videoCount)
    //     } catch (error) {
    //       console.log('Error fetching media:', error);
    //     }
    //   };
      
    //   fetchMediaCount()
    // },[])

    //Render Audio Messages
    const renderMessageAudio = (props) =>{
      const { currentMessage } = props;
        console.log(isPlaying)
            return (
             <>
             {
              currentMessage.audioUrl && 
              <View style={{ marginTop: 10 ,padding: 5, borderRadius: 10,  width:300, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {false ? (
                <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  <>
                  <TouchableOpacity onPress={() => playAudioFromFirestore(currentMessage.audioUrl)}>
                  <Text>
                    {
                      true ? <Ionicons
                      name="pause"
                      size={25}
                      color={'white'} />: 
                      <Ionicons
                      name="play"
                      size={25}
                      color={'white'} />
                      
                    }
                  </Text>
                  
                  </TouchableOpacity>
                  <MaterialCommunityIcons name="waveform" size={24} color= {'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  <MaterialCommunityIcons name="waveform" size={24} color={'white'} />
                  </>


                    )}
             </View>

    }
            
             </>
        //     
);

    }

    //Render Video Messages
    
    const renderMessageVideo = (props) => {
      const { currentMessage } = props;

      return (
      <>
      {
                currentMessage.video && 
                <TouchableOpacity 
                style={{ marginTop: 10 ,padding: 5, borderRadius: 10,  width:250, height: 100, flexDirection: 'row', justifyContent: 'space-between' }}
                onPress = {handleVideoPress}
                > 
                  <Video
                   ref={videoRef} // Attach the reference to the Video component
                  source={{ uri: currentMessage.video }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay={false} // By default, video should not autoplay
                  useNativeControls // Native play/pause controls
                  style={styles.video}
                />
                </TouchableOpacity>
            }
      </>
      )

    }

    //Render full screen videos when touched

    const handleVideoPress = async () => {
      
      if (videoRef.current) {
        await videoRef.current.presentFullscreenPlayer(); // Open the video in full-screen mode
      }
    };

   
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
        alert('Failed to start recording');
      }
      }
    //Stop record
    async function stopRecording() {
        setRecording(undefined);

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
    //console.log("Audio", audio)
    setRecordings(allRecordings);
      }

    //Play audio from firestore
    const playAudioFromFirestore = async (url) => {
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
      const handleSendAudio = async (recordingLine) => {
        setIsPlaying(false)
        recordingLine?.sound?.stopAsync()
        
          try {
            const response = await fetch(recordingLine.file);
            const blob = await response.blob();
            console.log("Blob: ", blob)
    
    
            // Create a reference in Firebase Storage
            const storageRef = ref(storage, `chats/${blob.name}`);
  
          // Upload the blob to Firebase storage    
            const uploadTask = uploadBytesResumable(storageRef, blob);
            //Save to reports
            uploadTask.on(
                  'state_changed',
                  () => {},
                  (error) => {
                    console.error('Upload failed:', error);
                  },)
                  // Get the download URL
                  const downloadURL = await getDownloadURL(storageRef);
                  console.log('Download URL:', downloadURL);

                  data['audioUrl'] = downloadURL
                  console.log("--------", downloadURL)
                   handleFirebaseSend()
                  console.log("Sent Successfully")
              }
             catch (error) {
              alert("Error Encountered")

            }
            
          }
    
      const handleCancelAudio =() => {
        clearRecordings()
        console.log("Canceled Successfully")
      }
    
      function clearRecordings() {
        setRecordings([])
      }
      
      function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
        //console.log("Record", recordingLine)
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
              <MaterialCommunityIcons name="waveform" size={24} color={colors.primary} />
             

              <Button styles= {styles.buton} title={recordings.length > 0 ? 'Send' : ''} onPress={()=> {handleSendAudio(recordingLine)}} />
              <Button styles= {styles.buton} title={recordings.length > 0 ? 'Cancel' : ''} onPress={handleCancelAudio} />
     
            </View>
          );
        });
      }
    


    const onSend = useCallback( async  (m = []) => { 
      //get text message and send to handlefirebaseSend 
        const messageToSend = { ...m[0], sent: true, received: false };
        data.text = messageToSend.text
      handleFirebaseSend()

        
  
   }, [ messages]);


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            await uploadImageAsync(result.assets[0]);
            
        }
    };

    async function uploadImageAsync(files) {

        const file = files;
        //console.log("File", file)
        const response = await fetch(file.uri);
        const blob = await response.blob(); // Convert response to Blob

        try {
          const fileRef = ref(storage, `chats/${file.name}`);
          const uploadTask = uploadBytesResumable(fileRef, blob);
          uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
              console.error('Upload failed:', error);
            },)
            const fileUrl = await getDownloadURL(fileRef);
            
            data['fileUrl'] = fileUrl
            data['fileType'] = file.mimeType
            data['filename'] = file.fileName
            console.log("FileUrl: ", file.mimeType)
            handleFirebaseSend()
  
          }
          catch (e)
          {
            //console.log(e)
            alert('Error encounterd while uploading File')
          }
    }
    const handleFirebaseSend = async () => {

      //Send all types of datas to firebase
      let location = []   
      let flag = false
      if(route.params.lat >= 90 || route.params.lng >= 90 ||route.params.lat <0  || route.params.lng < 0 ){
          flag= true
          location.push(Math.random() * (11.7920 - 11.7820) + 11.7820)
          location.push(Math.random() * (41.0130 - 41.0030) + 41.0030)
      }
      data['location'] = flag ? location: [route.params.lng, route.params.lat]
      data._id = uuid.v4()
      // console.log("Data to be sent,", data)

      try {      
              if(messages.length === 0)
              {
                await setDoc(doc(database, 'newreports', context.chatID), {
                  messages: arrayUnion(data),
                  lastUpdated: Date.now(),
              });
              }
              else{

                await updateDoc(doc(database, 'newreports', context.chatID), {
                    messages: arrayUnion(data),
                    lastUpdated: Date.now(),
                });
       console.log("Added Successfully!")
      }
      } catch (error) {
        //console.log(error)
        alert("Error while connecting to database")
      }
    clearRecordings()

    }
    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: colors.primary
                    },
                    left: {
                        backgroundColor: 'lightgrey'
                    }
                }}
            />
        )
    }

    function renderSend(props) {
        return (
            <>
                <View style={{flex:1, flexDirection:"row", justifyContent:"flex-end"}}>
                    <TouchableOpacity style={styles.recordIcon}  onPress={recording ? stopRecording : startRecording}>
                    
                            {getRecordingLines()}
                            {
                            recording && 
                            <Animated.View
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: 'red',
                                borderRadius: 10,
                                transform: [{ scale: pulseAnimation }],
                            }}
                            />

                            }
      
                            <Ionicons
                                name="mic-outline"
                                size={30}
                                color={colors.primary} />
                   </TouchableOpacity>
                    <TouchableOpacity style={styles.addImageIcon} onPress={pickImage}>
                        <Ionicons
                            name='image-outline'
                            size={30}
                            color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <Send {...props}>
                    <View style={{ justifyContent: 'center', height: '100%', marginLeft: 8, marginRight: 4, marginTop: 12 }}>
                        <Ionicons
                            name='send'
                            size={24}
                            color={colors.primary} />
                    </View>
                </Send>
            </>
        )
    }

    function renderInputToolbar(props) {
        return (
            <InputToolbar {...props}
                containerStyle={styles.inputToolbar}
                renderActions={renderActions}
            >
            </InputToolbar >
        )
    }

    function renderActions() {
        return (
            <TouchableOpacity style={styles.emojiIcon} onPress={handleEmojiPanel}>
                <View>
                    <Ionicons
                        name='camera-outline'
                        size={32}
                        color={colors.primary} />
                </View>
            </TouchableOpacity>
        )
    }
    

    function handleEmojiPanel() {
        if (modal) {
            setModal(false);
        } else {
            Keyboard.dismiss();
            setModal(true);
        }
    }

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                imageStyle={{
                    height: 212,
                    width: 212
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
                textInputStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                }}
                user={{
                    _id: '',
                    name: 'anonymous',
                    avatar: ''
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderUsernameOnMessage={false}
                renderInputToolbar={renderInputToolbar}
                minInputToolbarHeight={56}
                scrollToBottom={true}
                onPressActionButton={handleEmojiPanel}
                scrollToBottomStyle={styles.scrollToBottomStyle}
                renderLoading={renderLoading}
                renderCustomView={renderMessageAudio}
                renderMessageVideo = {renderMessageVideo}
            />

            {modal &&
            <Modal 
            animationType="slide"
            transparent={false}>
              <CameraCom 
              style= {styles.cameraContainer}
              setModal = {setModal}
              lat = {route.params.lat}
              lng = { route.params.lng}
              length = {messages.length} />
            </Modal>
            }
        </>
    );
}

const styles = StyleSheet.create({
    inputToolbar: {
        bottom: 6,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 16,
    },
    emojiIcon: {
        marginLeft: 4,
        bottom: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    emojiModal: {

    },
    cameraContainer: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
     
    },
    emojiBackgroundModal: {

    },
    scrollToBottomStyle: {
        borderColor: colors.grey,
        borderWidth: 2,
        width: 56,
        height: 56,
        borderRadius: 28,
        position: 'absolute',
        bottom: 12,
        right: 12
    },
    addImageIcon: {
        bottom: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        borderColor: "black"
    },
    recordIcon: {
        bottom: 8,
        width: 100,
        height: 32,
        borderRadius: 16,
        borderColor: "black",
        flex: 1,
        flexDirection: 'row',
        justifyContent:'flex-end'
    },
    button2: {
        width: 20,
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
      input:{
        width:400,
        height: 50,
        borderWidth: 2,
        flexDirection:'row',
        justifyContent: 'space-around'
      },
      row: {
        position:'absolute',
        bottom: 40,
        right: -35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        padding: 5,
        width: 380,
        height: 50,
        backgroundColor: 'white',
        marginLeft: 10,
      },
      buton: {
        backgroundColor: 'red'
      },
     
      fill: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
      },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Chat;