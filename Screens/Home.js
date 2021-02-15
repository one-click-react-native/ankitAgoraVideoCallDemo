import React, { useEffect, useState } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { Actions } from 'react-native-router-flux';
import requestPermission from '../Utils/permissions';

const HomeScreen=props=>{

    const tempToken="006e551115e6fb6481b97dda9d70111192aIAAG/AhaaTxwo5nQEprFCHv4Y9t+YNvRqTH/Zpz/ILetgHF4daQAAAAAEABFd1n8dc4nYAEAAQBxzidg"

    const [appDetail,setAppDetail]=useState({
        appID:'e551115e6fb6481b97dda9d70111192a',
        channelName:'videocallwithagora'
    });

    useEffect(()=>{
        requestPermission();
    },[])

    return(
        <View>
            <TouchableOpacity onPress={()=>{
                Actions.Video();
            }}>
                <Text>Go Video</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen;