import React from 'react';
import { StyleSheet } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { WelcomeScreen } from './screen/WelcomeScreen';
import { CameraScreen } from './screen/CameraScreen';
import { HomeScreen } from './screen/HomeScreen';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      username: null,
      isTakingPhoto: false,
      itemPhoto: null,
      itemDesc: null
    };

  }

  handleUsername(username) {
    this.setState({
      username: username
    })
  }

  toggleCamera() {
    this.setState({
      isTakingPhoto: !this.state.isTakingPhoto
    })
  }

  handlePhoto(photo) {
    console.log('app has received:');
    console.log(photo)
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

    // When taking a photo
    if (state.isTakingPhoto) {
      return (
        <CameraScreen toggleCamera={() => this.toggleCamera()} afterTakingPhoto={(photo) => this.handlePhoto(photo)} />
      );
    }

    // render HomeScreen By default
    return (
      <HomeScreen itemPhoto={this.state.itemPhoto} username={this.state.username} toggleCamera={() => this.toggleCamera()} />
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