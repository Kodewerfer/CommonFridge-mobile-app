import React from 'react';
import { StyleSheet } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { WelcomeScreen } from './screen/WelcomeScreen';
import { CameraScreen } from './screen/CameraScreen';
import { HomeScreen } from './screen/HomeScreen';
import { PhotoViewer } from './stateless/PhotoViewer';


export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      username: '',
      isTakingPhoto: false,
      itemPhoto: null,
      isViewingPhoto: false,
      itemDesc: ''
    };

  }

  receiveUsername(username) {
    this.setState({
      username: username
    })
  }

  toggleCamera() {
    this.setState({
      isTakingPhoto: !this.state.isTakingPhoto
    })
  }

  togglePhotoView() {
    this.setState({
      isViewingPhoto: !this.state.isViewingPhoto
    })
  }

  receivePhoto(photo) {
    this.setState({
      itemPhoto: photo
    })
  }

  receiveDesc(text) {
    return this.setState({
      itemDesc: text
    })
  }

  // Send data to server.
  async sendData() {

    // TODO: configurable URL.
    const URLprefix = 'http://ubishops-community-fridge.herokuapp.com';
    const fridgeID = '1';


    // mind the template strings.
    const infoURL = URLprefix + `/fridges/${fridgeID}/items`;


    // item name, user name 
    let infoRequest = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fridge_id: fridgeID,
        "user": {
          "name": "qianwang",
          "password": "424242"
        },
        "item_name": this.state.itemDesc

      }),
    }

    try {
      let response = await fetch(infoURL, infoRequest);
      let responseJson = await response.json();
      let actionID = await responseJson.action_id;

      const photoURL = await URLprefix + `/actions/${actionID}/picture`;
      const { base64 } = this.state.itemPhoto;


      // item's photo
      let photoRequest = await {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(base64)
      }

      let result = await fetch(photoURL, photoRequest);


      if (result.ok === 'true' || result.ok) {
        alert('Add success.')
      } else {
        alert('Sending Failed.')
      }

      return result;

    } catch (error) {
      console.error(error);
    }

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
        <WelcomeScreen
          whenSubmit={(username) => { this.receiveUsername(username) }}
        />
      );
    }

    // When taking a photo.
    if (state.isTakingPhoto) {
      return (
        <CameraScreen
          toggleCamera={() => this.toggleCamera()}
          afterTakingPhoto={(photo) => this.receivePhoto(photo)}
        />
      );
    }

    // When tap on the photo to view.
    if (state.isViewingPhoto) {
      return (
        <PhotoViewer
          itemPhoto={this.state.itemPhoto}
          togglePhotoView={() => this.togglePhotoView()}
        />
      );
    }

    // render HomeScreen By default
    return (
      <HomeScreen
        togglePhotoView={() => this.togglePhotoView()}
        itemPhoto={this.state.itemPhoto}
        username={this.state.username}
        setDesc={(text) => this.receiveDesc(text)}
        allDone={async () => this.sendData()}
        toggleCamera={() => this.toggleCamera()}
      />
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