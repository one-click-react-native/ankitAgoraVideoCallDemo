import React, { useEffect, useState } from 'react';
import {View,StyleSheet,NativeModules,Platform} from 'react-native';
import RtcEngine from 'react-native-agora';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import requestPermission from '../Utils/permissions';

// const {Agora}=NativeModules;
// const {
//     FPS30,
//     AudioProfileDefault,
//     AudioScenarioDefault,
//     Adaptative,
// }=Agora;

const VideoScreen=props=>{
    
    const [details,setDetails]=useState({
        peerIds:[],
        uid:Math.floor(Math.random()*100),
        appid:'e551115e6fb6481b97dda9d70111192a',
        channelName:'videocallwithagora',
        videoMute:false,
        audioMute:false,
        joinStatus:false
    });

    if(Platform.OS==='android'){

        // requestPermission();

        const config = {
            appid: details.appid, 
            channelProfile: 0,                       
            videoEncoderConfig: {
              width: 720,
              height: 1080,
              bitrate: 1,
            },
          
          };
          RtcEngine.init(config);
    }

    useEffect(()=>{
        
        RtcEngine.on('userJoined',(data)=>{
            const {peerIds}=details.peerIds;
            if(peerIds.indexOf(data.uid)===-1){
                setDetails({
                    ...details,
                    peerIds:[...peerIds,data.uid]
                })
            }
        });

        RtcEngine.on('userOffline',(data)=>{
            setDetails({
                ...details,
                peerIds:details.peerIds.filter(uid=>uid!== data.uid)
            })
        })

        RtcEngine.on('joinChannelSuccess',(data)=>{
            RtcEngine.startPreview();
            setDetails({
                ...details,
                joinStatus:true
            })
        })
        RtcEngine.joinChannel(details.channelName,details.uid);
        RtcEngine.enableAudio();

    },[])

    const audioClickHandler=()=>{
        let mute=details.audioMute;
        console.log("Audio CLick : ",mute);
        RtcEngine.muteLocalAudioStream(!mute);
        setDetails({
            ...details,
            audioMute:!mute
        })
    }

    const videoClickHandler=()=>{
        let mute=details.videoMute;
        console.log("Video CLick : ",mute);
        RtcEngine.muteLocalVideoStream(!mute);
        setDetails({
            ...details,
            videoMute:!mute
        })
    }

    const endCall=()=>{
        RtcEngine.destroy();
        Actions.Home();
    }

    return(
        <View style={{ flex: 1 }}>
        {
          details.peerIds.length > 3 
            ? <View style={{ flex: 1 }}>
              <View style={{ flex: 1 / 2, flexDirection: 'row' }}><AgoraView style={{ flex: 1 / 2 }}
                remoteUid={details.peerIds[0]}
                mode={1} />
                <AgoraView style={{ flex: 1 / 2 }}
                  remoteUid={details.peerIds[1]}
                  mode={1} /></View>
              <View style={{ flex: 1 / 2, flexDirection: 'row' }}><AgoraView style={{ flex: 1 / 2 }}
                remoteUid={details.peerIds[2]}
                mode={1} />
                <AgoraView style={{ flex: 1 / 2 }}
                  remoteUid={details.peerIds[3]}
                  mode={1} /></View>
            </View>
            : details.peerIds.length > 2  
              ? <View style={{ flex: 1 }}>
                <View style={{ flex: 1 / 2 }}><AgoraView style={{ flex: 1 }}
                  remoteUid={details.peerIds[0]}
                  mode={1} /></View>
                <View style={{ flex: 1 / 2, flexDirection: 'row' }}><AgoraView style={{ flex: 1 / 2 }}
                  remoteUid={details.peerIds[1]}
                  mode={1} />
                  <AgoraView style={{ flex: 1 / 2 }}
                    remoteUid={details.peerIds[2]}
                    mode={1} /></View>
              </View>
              : details.peerIds.length > 1   
                ? <View style={{ flex: 1 }}><AgoraView style={{ flex: 1 }}
                  remoteUid={details.peerIds[0]}
                  mode={1} /><AgoraView style={{ flex: 1 }}
                    remoteUid={details.peerIds[1]}
                    mode={1} /></View>
                : details.peerIds.length > 0
                  ? <AgoraView style={{ flex: 1 }}
                    remoteUid={details.peerIds[0]}
                    mode={1} />
                  : <View />
        }
        {
          !details.videoMute
            ? <AgoraView style={styles.localVideoStyle} zOrderMediaOverlay={true} showLocalVideo={true} mode={1} />
            : <View />
        }
        <View style={styles.buttonBar}>
          <Icon.Button style={styles.iconStyle}
            backgroundColor="#0093E9"
            name={details.audioMute ? 'mic-off' : 'mic'}
            onPress={audioClickHandler}
          />
          <Icon.Button style={styles.iconStyle}
            backgroundColor="#0093E9"
            name="call-end"
            onPress={endCall}
          />
          <Icon.Button style={styles.iconStyle}
            backgroundColor="#0093E9"
            name={details.videoMute ? 'videocam-off' : 'videocam'}
            onPress={videoClickHandler}
          />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    buttonBar: {
      height: 50,
      backgroundColor: '#0093E9',
      display: 'flex',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
    },
    localVideoStyle: {
      width: 140,
      height: 160,
      position: 'absolute',
      top: 5,
      right: 5,
      zIndex: 100,
    },
    iconStyle: {
      fontSize: 34,
      paddingTop: 15,
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 15,
      borderRadius: 0,
    },
  });

export default VideoScreen;