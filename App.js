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
      itemDesc: null
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
    this.setState({
      itemDesc: text
    })
  }

  // Send data to server.
  async sendData() {

    // TODO: configurable URL.
    const URLprefix = 'http://ubishops-community-fridge.herokuapp.com';
    const fridgeID = '1';
    let actionID = '';

    // mind the template strings.
    const infoURL = URLprefix + `/fridges/${fridgeID}/items`;
    const photoURL = URLprefix + `/actions/${actionID}/picture`;

    // item name, user name 
    let infoRequest = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fridge_id: fridgeID,
        body: {
          "user": {
            "name": "qianwang",
            "password": "424242"
          },
          "item_name": this.state.itemDesc
        },
      }),
    }

    // item's photo
    let photoRequest = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action_id: actionID,
        picture: 'yourOtherValue',
      }),
    }



    return fetch(infoURL, infoRequest)
      .then((response) => {
        debugger
        console.log(response)
        // return null;
        // return JSON.stringify(response)
      })
      .then((responseJson) => {
        console.log(responseJson)

        if (!responseJson || !responseJson.action_id || responseJson.action_id === '') {
          console.error('Action ID is empty');
          alert('An error has occured, try again later.');
          return;
        }
        return responseJson.action_id;
      })
      .then(() => {

      })
      .catch((error) => {
        console.error('Error occured during sending' + error);
      });

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
        allDone={() => this.sendData()}
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