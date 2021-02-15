import React from 'react';
import {ActionConst,Router,Scene} from 'react-native-router-flux';
import HomeScreen from '../Screens/Home';
import VideoScreen from '../Screens/VideoScreen';

const RoutNavigator=()=>{
    return(
        <Router>
            <Scene>
                <Scene key="Home" component={HomeScreen} title='Video Call' initial type={ActionConst.RESET} />
                <Scene key="Video" component={VideoScreen} title="Video Screen" type={ActionConst.RESET} hideNavBar={true}/>
            </Scene>
        </Router>
    )
}

export default RoutNavigator;