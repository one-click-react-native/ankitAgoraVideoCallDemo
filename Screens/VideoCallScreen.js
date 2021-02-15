import React, { useEffect, useState } from 'react';
import {Dimensions, Platform,ScrollView,Text,TouchableOpacity,View} from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import Permissions from 'react-native-permissions';
import styles from '../Styles'
import requestPermission from '../Utils/permissions';

const VideoCallScreen=props=>{
   
    const height=Dimensions.get('window').height;
    const width=Dimensions.get('window').width;
    const localViewStyle=(width < height ? width : height)*0.3;
    
    const [details,setDetails]=useState({
        appId:'e551115e6fb6481b97dda9d70111192a',
        channelName:'videocallwithagora',
        token:'006e551115e6fb6481b97dda9d70111192aIABz4j4SwnSvLjEbAgbeIklqGUe5KZ0WVhLoTimk0LcBCHF4daQAAAAAEABFd1n8h1QrYAEAAQCGVCtg',
        joinStatus:false,
        peerIds:[]
    })

   
    if(Platform.OS==='android'){
        requestPermission();
    }

    useEffect(()=>{
        init();
    },[])
    

    const init=async()=>{
        const engine=await RtcEngine.create(details.appId);
        await engine.enableVideo();


        engine.addListener('UserJoined',(uid,elapsed)=>{
            console.log("User detial jOined : ",uid,elapsed);
            if(details.peerIds.indexOf(uid)===-1){
                setDetails({
                    ...details,
                    peerIds:[...details.peerIds,uid],
                    joinStatus:true
                })
            }
        })

        engine.addListener('UserOffline',(uid,reason)=>{
            console.log("Offline :",uid,reason);
            setDetails({
                ...details,
                peerIds:details.peerIds.filter(id=>id!==uid)
            })
        })

        engine.addListener('JoinChannelSuccess',(channel,uid,elapsed)=>{
            console.log("User detial jOined : ",uid,elapsed,channel);
            engine.startPreview()
            setDetails({
                ...details,
                joinStatus:true
            })
        })
    }
    const startCall=async()=>{
        await (await RtcEngine.create(details.appId)).joinChannel(details.token,details.channelName,null,0);

    }

    const endCall=async()=>{
        await (await RtcEngine.create(details.appId)).leaveChannel();
        setDetails({
            ...details,
            peerIds:[],
            joinStatus:false
        })
    }
console.log(details)

    
    return(
        <View style={styles.max}>
                <View style={styles.max}>
                    <View style={styles.buttonHolder}>
                        <TouchableOpacity
                            onPress={startCall}
                            style={styles.button}>
                            <Text style={styles.buttonText}> Start Call </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={endCall}
                            style={styles.button}>
                            <Text style={styles.buttonText}> End Call </Text>
                        </TouchableOpacity>
                    </View>
                    {
        details.joinStatus ?
        <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
            style={styles.max}
            channelId={details.channelName}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={false}

        />
       <ScrollView
                style={styles.remoteContainer}
                contentContainerStyle={{paddingHorizontal:2.5}}
                horizontal={true}
            >{
                details.peerIds.map?.((value,index,array)=>{
                    return(
                    <RtcRemoteView.SurfaceView
                    style={styles.remote}
                    key={index}
                    uid={value}
                    channelId={details.channelName}
                    renderMode={VideoRenderMode.Hidden}
                />
                    )
                })
            }
               

            </ScrollView>
        </View>
        : null

    }
                </View>
            </View>
    )
}

export default VideoCallScreen;