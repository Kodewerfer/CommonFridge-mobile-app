import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Dimensions,
  Keyboard,
  Animated,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { withMappedNavigationProps } from 'react-navigation-props-mapper';

@withMappedNavigationProps()
export class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Add item',
  };

  constructor(props) {
    super(props);

    this.state = {
      isSendingData: false,
      isKeyboardUp: false,
      itemDesc: ''
    }

    // storing critical information
    this.username = props.username;
    this.itemPhoto = props.itemPhoto;

    // animation
    this.topWrapperOpacity = new Animated.Value(1);
    this.keyboardHeight = new Animated.Value(0);

    this.topWrapperHeight = new Animated.Value(this.getDimensions().topHeight);
    this.bottomWrapperHeight = new Animated.Value(this.getDimensions().btmHeight);
  }

  onChangeText(text) {
    this.setState({
      itemDesc: text
    })

    // this.props.setDesc(text);
  }

  async onSubmitting() {

    if (this.state.isSendingData) {
      alert('sending data, please wait.')
      return
    }

    this.setState({
      isSendingData: true
    })

    if (!this.props.itemPhoto) {
      alert('Please take a photo of the item');
      return;
    }

    if (this.state.itemDesc === '' || !this.state.itemDesc) {
      alert('Please enter a item description.')
      return;
    }

    let result = await this.sendData();
    if (await result) {
      this.setState({
        isSendingData: false
      })
    }

  }

  // Send data to server.
  async sendData() {

    // TODO: configurable URL.
    const urlPrefix = 'http://ubishops-community-fridge.herokuapp.com';
    const fridgeID = '1';


    // mind the template strings.
    const infoURL = urlPrefix + `/fridges/${fridgeID}/items`;


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
          "name": this.props.username,
          "password": "424242"
        },
        "item_name": this.state.itemDesc

      }),
    }


    // first request, send item name.
    // get action ID.
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

    // second request, send item photo
    // using action ID
    try {

      const photoURL = await urlPrefix + `/actions/${actionID}/picture`;
      const { base64 } = this.props.itemPhoto;


      // item's photo
      let photoRequest = {
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

  renderImageArea() {
    const imgURI = this.props.itemPhoto ? this.props.itemPhoto.uri : '';

    if (imgURI === '') {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('camera')}
        >

          <Text style={Styles.tipsText}> Tap to take a photo</Text>
          <View style={Styles.iconWrapper}>
            <Icon name="plus" size={100} color="#fff" />
          </View>

        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('photoview', {
          itemPhoto: this.props.itemPhoto
        })}
        onLongPress={() => this.props.navigation.navigate('camera')}>

        <Text style={Styles.tipsText}> Tap to view</Text>
        <Text style={Styles.tipsText}> Hold to take a new one</Text>
        <Image source={{ uri: imgURI }} style={Styles.imgPort}></Image>

      </TouchableOpacity>
    )
  }

  render() {

    const inputTop = "It's / They're ..."


    return (
      <View style={Styles.container}>
        <Animated.View style={[Styles.containerInner, { paddingBottom: this.keyboardHeight, }]}>

          <Animated.View style={[Styles.topWrapper, { height: this.topWrapperHeight }, { opacity: this.topWrapperOpacity }]}>

            <View style={Styles.containerMid}>
              {this.renderImageArea()}
            </View>

          </Animated.View>

          <Animated.View style={[Styles.bottomWrapper, { height: this.bottomWrapperHeight }]}>

            <View style={Styles.containerBtm}>
              <Text style={[Styles.text, { fontSize: 15 }]}>{inputTop}</Text>
              <TextInput
                style={Styles.textbox}
                textContentType={'givenName'}
                placeholder={this.state.itemDesc}
                onChangeText={(text) => this.onChangeText(text)}
              />

              <TouchableOpacity onPress={() => this.onSubmitting()}>
                <View style={Styles.submitBtn}>
                  <Text style={{ color: '#fff', fontSize: 20, alignSelf: 'center', }}>Done</Text>
                </View>
              </TouchableOpacity>

            </View>
          </Animated.View>

        </Animated.View>
      </View>
    );
  }

  // Animation preparing
  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);

  }

  // === Animation ===
  _keyboardWillShow = (event) => {

    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height + 50,
      }),
      Animated.timing(this.topWrapperOpacity, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.topWrapperHeight, {
        duration: event.duration,
        toValue: this.getDimensions().windowHeight / 4,
      }),

    ]).start();

  }

  _keyboardWillHide = (event) => {

    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.topWrapperOpacity, {
        duration: event.duration,
        toValue: 1,
      }),
      Animated.timing(this.topWrapperHeight, {
        duration: event.duration,
        toValue: this.getDimensions().topHeight,
      }),

    ]).start();

  }

  getDimensions = () => {
    const windowHeight = Dimensions.get('window').height;
    const topHeight = windowHeight / 2;

    return {
      windowHeight: windowHeight,
      topHeight: topHeight,
      btmHeight: windowHeight - topHeight
    }
  }
}

const Styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: '#616161',
  },
  welcomeText: {
    color: '#fff',
  },
  tipsText: {
    alignSelf: 'center',
    color: '#616161',
    fontSize: 15,
    paddingBottom: 5
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#4F2D7F',
  },
  containerInner: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: '#ededed',
  },
  topWrapper: {
  },
  bottomWrapper: {
  },
  imgPort: {
    borderRadius: 15,
    width: 205,
    height: 205
  },
  iconWrapper: {
    backgroundColor: '#e3e3e3',
    padding: 50,
    paddingHorizontal: 60,
    borderRadius: 10,
    borderColor: "#7f7f7f",
    borderStyle: "dashed",
    borderWidth: 2
  },
  textbox: {
    borderColor: "#7f7f7f",
    borderWidth: 2,
    borderStyle: "dotted",
    fontFamily: 'space-mono',
    textAlign: "center",
    width: 300,
    backgroundColor: '#fff',
    fontSize: 20,
    padding: 15,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 10

  },
  submitBtn: {
    borderRadius: 10,
    width: 230,
    alignContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#2ac12a',
  },
  containerMid: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBtm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  invis: {
    display: "none"
  }
});