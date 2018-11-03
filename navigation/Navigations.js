import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

// For adding
import { WelcomeScreen } from '../screen/WelcomeScreen';
import { HomeScreen } from '../screen/HomeScreen';
// For fetching

import { PhotoViewer } from '../modal/PhotoViewer';
import { CameraScreen } from '../modal/CameraScreen';

const MainNavigation = createSwitchNavigator({
  welcome: WelcomeScreen,
  home: HomeScreen,
}, {
    initialRouteName: 'welcome',
  });

const RootNavigation = createStackNavigator({
  main: MainNavigation,
  photoview: PhotoViewer,
  camera: CameraScreen
}, {
    mode: 'modal',
    headerMode: 'none'
  });


export default RootNavigation;