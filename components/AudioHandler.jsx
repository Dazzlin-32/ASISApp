import { StyleSheet, Text, View, Button, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState, useRef } from 'react';

export default function AudioHandler() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false)




const pulseAnimation = useRef(new Animated.Value(1)).current;

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



  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.error(err)
    }
  }

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
    console.log(recording)

    setRecordings(allRecordings);
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
  }
  const handlePlay = ( recordingLine) =>{
    if (isPlaying ) {
      recordingLine.sound.stopAsync()
      setIsPlaying(false)
    } 
    else {
      recordingLine.sound.replayAsync()
    
      setIsPlaying(true)
      recordingLine.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }

    
  }
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(true);
      console.log("is playing did just finish", isPlaying)
    }
  };

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
    
           <Button  style={styles.button2} onPress={() => {
            handlePlay(recordingLine)
            }
            } title="||"></Button>
              {
        isPlaying && 
        <Animated.View
        style={{
          width: 10,
          height: 10,
          backgroundColor: 'green',
          borderRadius: 10,

          transform: [{ scale: pulseAnimation }],
        }}
      />}
    
            
          
          
        </View>
      );
    });
  }

  function clearRecordings() {
    setRecordings([])
  }
  const handleSendAudio =() => {
    console.log("Sent Successfully")
  }

  const handleCancelAudio =() => {
    clearRecordings()
    console.log("Canceled Successfully")
  }

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Button title={recording ? 'Stop' : 'Start'} onPress={recording ? stopRecording : startRecording} />
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
        />}
        {
          recordings.length >0 &&
          <>
            <Button styles= {styles.buton} title={recordings.length > 0 ? 'Send' : ''} onPress={handleSendAudio} />
            <Button styles= {styles.buton} title={recordings.length > 0 ? 'Cancel' : ''} onPress={handleCancelAudio} />
          </>

        }
        
        

      </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 2,
    width: 250,
    backgroundColor: 'white'
   
  },
  buton: {
    backgroundColor: 'red'
  },
  button2: {
    width: 20,
  },
  fill: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
  },
});