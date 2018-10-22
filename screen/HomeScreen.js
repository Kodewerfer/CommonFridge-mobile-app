import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions, Animated, StyleSheet, Text, Image, View, Keyboard, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';

export class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isKeyboardUp: false,
    }
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);

  }

  renderCenter() {
    const imgURI = this.props.itemPhoto ? this.props.itemPhoto.uri : '';

    if (imgURI === '') {
      return (
        <TouchableOpacity onPress={() => this.props.toggleCamera()}>

          <Text style={Styles.tipsText}> Tap to take a photo</Text>
          <View style={Styles.iconWrapper}>
            <Icon name="plus" size={100} color="#fff" />
          </View>

        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.togglePhotoView()}
        onLongPress={() => this.props.toggleCamera()}>
        <Text style={Styles.tipsText}> Tap to view</Text>
        <Text style={Styles.tipsText}> Hold to take a new one</Text>
        <Image source={{ uri: imgURI }} style={Styles.imgPort}></Image>

      </TouchableOpacity>
    )
  }

  keyboardAccordanceRender() {


    if (!this.state.isKeyboardUp) {
      return (
        <View style={Styles.topWrapper}>

          <View style={Styles.containerTop}>

            <Text style={[Styles.text, { fontSize: 30 }]}>Welcome!</Text>
            <Text style={[Styles.text, { fontSize: 30 }]}>{this.props.username}</Text>

          </View>

          <View style={Styles.containerMid}>
            {this.renderCenter()}
          </View>

        </View>
      );
    }


  }

  render() {

    const inputTop = 'Item description'

    this.topWrapperOpacity = new Animated.Value(1);
    this.keyboardHeight = new Animated.Value(0);
    this.topWrapperHeight = new Animated.Value(this.getDimensions().topWH);
    this.bottomWrapperHeight = new Animated.Value(this.getDimensions().btmWH);

    return (
      <View style={Styles.container}>
        <Animated.View style={[Styles.containerInner, { paddingBottom: this.keyboardHeight, }]}>

          <Animated.View style={[Styles.topWrapper, { height: this.topWrapperHeight }, { opacity: this.topWrapperOpacity }]}>

            <View style={Styles.containerTop}>

              <Text style={[Styles.text, { fontSize: 30 }]}>Welcome!</Text>
              <Text style={[Styles.text, { fontSize: 30 }]}>{this.props.username}</Text>

            </View>

            <View style={Styles.containerMid}>
              {this.renderCenter()}
            </View>

          </Animated.View>

          <Animated.View style={[Styles.bottomWrapper, { height: this.bottomWrapperHeight }]}>

            <View style={Styles.containerBtm}>
              <Text style={Styles.text}>{inputTop}</Text>
              <TextInput
                style={Styles.textbox}
                textContentType={'givenName'}
                onChangeText={(text) => { }}
                onSubmitEditing={() => { }}
              />

              <TouchableOpacity onPress={() => this.onSubmit()}>
                <View style={Styles.submitBtn}>
                  <Text style={{ color: '#fff', fontSize: 15 }}>Submit</Text>
                </View>
              </TouchableOpacity>

            </View>
          </Animated.View>

        </Animated.View>
      </View>
    );
  }

  _keyboardDidShow = (event) => {

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

  _keyboardDidHide = (event) => {
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
        toValue: this.getDimensions().topWH,
      }),

    ]).start();
  }

  getDimensions() {
    const windowHeight = Dimensions.get('window').height;
    const topWH = windowHeight / 1.6;

    return {
      windowHeight: windowHeight,
      topWH: topWH,
      btmWH: windowHeight - topWH
    }
  }


}

const Styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: '#616161',
    fontSize: 22,


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
    borderRadius: 20,
    // height: '100%',
    backgroundColor: '#F8ECC2',
  },
  topWrapper: {
    height: "65%",
  },
  bottomWrapper: {
    height: "35%"
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
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderWidth: 2
  },
  textbox: {
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
    paddingLeft: 100,
    paddingRight: 100,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#2ac12a',
  },
  containerTop: {
    flex: 0.6,
    // height:'20%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  containerMid: {
    flex: 1.5,
    // height:'60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBtm: {
    flex: 1,
    // height:'20%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  invis: {
    display: "none"
  }
});