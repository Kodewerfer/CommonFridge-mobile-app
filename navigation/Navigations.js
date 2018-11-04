import { createStackNavigator } from 'react-navigation';

// For adding
import { WelcomeScreen } from '../screen/WelcomeScreen';
import { HomeScreen } from '../screen/HomeScreen';
// For fetching
import { ListScreen } from '../screen/ListScreen';

import { PhotoViewer } from '../modal/PhotoViewer';
import { CameraScreen } from '../modal/CameraScreen';

const MainNavigation = createStackNavigator({
  welcome: WelcomeScreen,
  home: HomeScreen,
  list: ListScreen,

}, {
    initialRouteName: 'welcome',
    headerMode: 'none'
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