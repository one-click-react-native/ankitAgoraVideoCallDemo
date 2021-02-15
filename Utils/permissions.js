import {PermissionsAndroid, ToastAndroid} from 'react-native';
import Permission from 'react-native-permissions';
const requestPermission=async()=>{
    try{
        const granted=await Permission.requestMultiple([
            Permission.PERMISSIONS.ANDROID.CAMERA,
            Permission.PERMISSIONS.ANDROID.RECORD_AUDIO
        ]);
        if(
            granted["android.permission.RECORD_AUDIO"]===Permission.RESULTS.GRANTED &&
            granted["android.permission.CAMERA"]===Permission.RESULTS.GRANTED
        ){
            ToastAndroid.show("Permission granted!",ToastAndroid.SHORT);
        }else{
            ToastAndroid.show("Permission denied!",ToastAndroid.SHORT);
        }
    }catch(err){
        console.warn(err)
    }
}

export default requestPermission;