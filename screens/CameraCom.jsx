import { StatusBar } from 'expo-status-bar';
import React, {useState, useRef, useEffect, useContext} from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions,  useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import Button from '../components/Button';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { database ,storage} from '../config/firebase';
import { arrayUnion, doc ,setDoc, updateDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import { ImportantContext} from '../App';


export default function CameraCom({setModal, lat, lng, length}) {
  
    //const navigation = useNavigation()
    const context = useContext(ImportantContext)
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [audioPermission, requestMicrophonePermission] = useMicrophonePermissions();;
    const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [cameraProps, setCameraProps] = useState({
        zoom: 0,
        facing: 'back',
        flash: 'on', 
        animateShutter: false,
        enableTorch: false
    });
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [isRecording, setIsRecording]  = useState(false);
    const [previousImage, setPreviousImage] = useState(null);

    const cameraRef = useRef(null);
    const videoRef = useRef(null);

    //to load the last saved image when permissions change
    useEffect(() => {
        if(cameraPermission && cameraPermission.granted && audioPermission && audioPermission.granted) {
            //getLastSavedImage();
            setImage(null)
        }
        getPersmissions()
    }, [cameraPermission, audioPermission, mediaLibraryPermissionResponse ])
    
    async function getPersmissions() {
        if (!cameraPermission ) {
            // Permissions are still loading.
            alert("Camera Permission Required")
            return requestCameraPermission();
        }
        if (!audioPermission)
        {
          alert("Audio Permission Required")
          return requestMicrophonePermission();
        }

        if(!mediaLibraryPermissionResponse) {
          handleRequestPermission()
          return requestMediaLibraryPermission()
        }
      
    }
    const handleRequestPermission = async () => {
      const { status } = await requestMediaLibraryPermission();
      if (status !== 'granted') {
        alert('Media Library permission is required to save pictures.');
      }
    };

  
    // if (!cameraPermission.granted ) {
    //     // Permissions are not granted yet.
    //     return (
    //       <View style={styles.container}>
    //           <Text>We need camera and gallery permissions to continue.</Text>
    //           <TouchableOpacity style={styles.button} onPress={() => {
    //               requestCameraPermission();
    //               requestMediaLibraryPermission();
    //           }} >
    //               <Text style={styles.buttonText}>Grant Permissions</Text>
    //           </TouchableOpacity>
    //       </View>
    //     )
    // }
  
    //function to toggle camera properties
    const toggleProperty = (prop, option1, option2) => {
        setCameraProps((current) => ({
            ...current,
            [prop]:current[prop] === option1 ? option2 : option1
        }));
    };

    //function to zoom in
    const zoomIn = () => {
        setCameraProps((current) => ({
            ...current,
            zoom: Math.min(current.zoom + 0.1, 1)
        }))
    }

    //function to zoom out
    const zoomOut = () => {
      setCameraProps((current) => ({
          ...current,
          zoom: Math.max(current.zoom - 0.1, 0)
      }))
  }

  //function to take a picture and show it without saving it
  const takePicture = async() => {
      if(cameraRef.current) {
          try {
              const picture = await cameraRef.current.takePictureAsync();
              setImage(picture.uri);
          } catch (err) {
            console.log('Error while taking the picture : ', err);
            alert('Error while taking the picture ')
          }
      }
  }

  //function to save the picture using MediaLibrary
  const savePicture = async() => {
      if(image) {
          try {
              const asset = await MediaLibrary.createAssetAsync(image);
              const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
              
              setImage(null);
              //getLastSavedImage();
              uploadImageAsync(assetInfo)

          } catch (err) {
              console.log('Error while saving the picture : ', err);
              alert('Error while saving the picture : ', err)
              setModal(false)
          }
      }
  }

  //function to upload picture to firebase

  async function uploadImageAsync(assetInfo) {

    const fileName = assetInfo.uri.substring(assetInfo.uri.lastIndexOf('/') + 1);
    let arr  = fileName.split('.')
    fileType = 'Image/' + arr[1]
    // Fetch the file from the local URI
     const response = await fetch(assetInfo.uri);
     const blob = await response.blob(); // Convert response to Blob
    
    const fileRef = ref(storage, `chats/${fileName}`);
    const uploadTask = uploadBytesResumable(fileRef, blob);
    

    uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        console.error('Upload failed:', error);
      },)
    try {
        const fileUrl = await getDownloadURL(fileRef);
        let data = {
            _id: uuid.v4(),
            createdAt: new Date(),
            received: false,
            sent: true,
            text: '',
            user : {
              _id: '',
              avatar: '',
              name : 'anonymous'      
            },
            fileUrl,
            filename: fileName,
            fileType: fileType.toLowerCase(),
          }
        
        
        console.log("--------", data)
        let location = []   
            let flag = false
            if( lat >= 90 || lng >= 90 || lat <0  || lng < 0 ){
                flag= true
                location.push(Math.random() * (11.7920 - 11.7820) + 11.7820)
                location.push(Math.random() * (41.0130 - 41.0030) + 41.0030)
            }
            if(length === 0)
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
                });}
          console.log("Added Successfully!")
          setModal(false)
      }
      catch (e)
      {
        console.log(e)
        alert('Error while uploading the picture. Please Try again ')
        setModal(false)
      }
      setModal(false)
}

  // //function to get the last saved image from the 'DCIM' album created in the gallery by expo
  // const getLastSavedImage = async() => {
  //     if(mediaLibraryPermissionResponse && mediaLibraryPermissionResponse.status === 'granted') {
  //         const dcimAlbum = await MediaLibrary.getAlbumAsync('DCIM');

  //         if(dcimAlbum) {
  //             const {assets} = await MediaLibrary.getAssetsAsync({
  //                 album: dcimAlbum,
  //                 sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  //                 mediaType: MediaLibrary.MediaType.photo,
  //                 first: 1
  //             });

  //             if(assets.length > 0) {
  //                 const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
  //                 setPreviousImage(assetInfo.localUri || assetInfo.uri);
  //             } else {
  //                 setPreviousImage(null);
  //             }

  //         } else {
  //             setPreviousImage(null);
  //         }
  //     }
  // }

  //function to record Video
  const startRecord = async() => {
    console.log("Started")
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false
    };
    if(cameraRef.current) {
    
        try {
            // const vid = await cameraRef.current.recordAsync();
            // videoRef.current = vid
            // setVideo(vid.uri);
            // console.log(vid)
            console.log("At record one --",isRecording)
            cameraRef.current.recordAsync(options)
            .then((recordedVideo) => {
              setVideo(recordedVideo);
              setIsRecording(true);
              
            })
            .catch((error)=> console.log(error))
          setIsRecording(true);
          console.log("At record two --" , isRecording)
        } catch (err) {
          console.log('Error while taking the video : ', err);
          Alert.alert('Error while taking the video')
        }
    }
} 
  const stopRecord = async() => {
    console.log("Stoppes")
    console.log("At stop one --" , isRecording)
    if ( isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      console.log(video)
    }
}





  return (
    <View style={styles.container}>
      {!image ? (
          <>
              <View style={styles.topControlsContainer}>
              
              <Button 
                  icon={cameraProps.flash === 'on' ? 'flash-on' : 'flash-off'}
                  onPress={() => toggleProperty('flash', 'on', 'off')}
              />
              <Button 
                  icon='animation'
                  color={cameraProps.animateShutter ? 'white' : '#404040'}
                  onPress={() => toggleProperty('animateShutter', true, false)}
              />
              <Button 
                  icon={cameraProps.enableTorch ? 'flashlight-on' : 'flashlight-off'}
                  onPress={() => toggleProperty('enableTorch', true, false)}
              />
            </View>
            <CameraView 
                style={styles.camera} 
                zoom={cameraProps.zoom}
                facing={cameraProps.facing}
                flash={cameraProps.flash}
                animateShutter={cameraProps.animateShutter}
                enableTorch={cameraProps.enableTorch}
                ref={cameraRef}
            />
            <View style={styles.sliderContainer}>
              <Button 
                  icon='zoom-out'
                  onPress={zoomOut}
              />
              <Slider 
                  style= {styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={cameraProps.zoom}
                  onValueChange={(value) => setCameraProps((current) => ({...current, zoom:value}))}
                  step={0.1}
              />
              <Button 
                  icon='zoom-in'
                  onPress={zoomIn}
              />
            </View>
            <View style={styles.bottomControlsContainer}> 
                

                <Button 
                    icon='cancel'
                    size={35}
                    style={{height:35}}
                    onPress={()=>{setModal(false)}}
                />
                <Button 
                    icon='videocam'
                    size={35}
                    style={{height:35}}
                    onPress={() => isRecording? stopRecord() : startRecord()}
                />
                
                <Button 
                    icon='camera'
                    size={35}
                    style={{height:35}}
                    onPress={takePicture}
                />
                <Button 
                  icon='flip-camera-ios'
                  onPress={() => toggleProperty('facing', 'front', 'back')}
                  size={35}
              />
            </View>
          </>
      ) : (
          <>
              <Image source={{uri:image}} style={styles.camera}/>
              <View style={styles.bottomControlsContainer}>
                  <Button 
                      icon='flip-camera-android'
                      onPress={()=> setImage(null)}
                  />
                  <Button 
                      icon='check'
                      onPress={savePicture}
                  />
              </View>
          </>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topControlsContainer: {
    height: 50,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
    borderRadius: 5,
},
buttonText: {
    color: 'white',
    fontSize: 16,
},
camera: {
  flex:1,
  width: '100%',
},
slider: {
  flex:1,
  marginHorizontal: 10,
},
sliderContainer: {
  position: 'absolute',
  bottom: 75,
  left : 20,
  right: 20,
  flexDirection: 'row'
},
bottomControlsContainer: {
  height:50,
  backgroundColor: 'black',
  flexDirection: 'row',
  justifyContent:'space-around',
  alignItems:'center'
},
previousImage: {
  width:60,
  height:60,
  borderRadius: 50
}
});