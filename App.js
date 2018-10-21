import React from 'react';
import { StyleSheet } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { WelcomeScreen } from './screen/WelcomeScreen';
import { CameraScreen } from './screen/CameraScreen';
import { HomeScreen } from './screen/HomeScreen';


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    username: null,
    isTakingPhoto: false,
    thePhoto: null,
    description: null
  };

  handleUsername(username) {
    this.setState({
      username: username
    })
  }

  render() {

    // loading resouces process, unused for now.
    const state = this.state;
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    // no username yet, render the welcome screen.
    if (!state.username) {
      return (
        <WelcomeScreen whenSubmit={(username) => { this.handleUsername(username) }} />
      );
    }

    // when taking a photo
    if (state.isTakingPhoto) {
      return (
        <CameraScreen />
      );
    }

    return (
      <HomeScreen username={this.state.username} />
    )
  }



  _loadResourcesAsync = async () => {
    return Promise.all([

      Font.loadAsync({
        // This is the font that we are using for our tab bar
        // ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});