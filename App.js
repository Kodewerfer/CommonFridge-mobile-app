import React from 'react';
import { AppLoading, Asset, Font, Icon } from 'expo';

import RootNavigation from './navigation/Navigations'

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


    let response, responseJson, actionID;
    try {

      response = await fetch(infoURL, infoRequest);
      responseJson = await response.json();
      actionID = await responseJson.action_id;

    } catch (e) {
      debugger
      alert("Sending failed, server return with invalid response.")
      return;
    }


    try {

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
        alert('success.')
      } else {
        alert('Sending Failed. Server did not register the item.')
      }

      return result;

    } catch (error) {
      alert('Image sending failed.')
      // console.error(error);
    }

  }

  renderOLD() {

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
        itemDesc={this.state.itemDesc}
        setDesc={(text) => this.receiveDesc(text)}
        allDone={async () => this.sendData()}
        toggleCamera={() => this.toggleCamera()}
      />
    )
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

    return (<RootNavigation />)
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