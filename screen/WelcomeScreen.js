import React, { Component } from 'react';
import {
  Dimensions,
  Keyboard,
  Animated,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

export class WelcomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTextInput: false,
      username: '',
      isNameEmpty: true
    }

    this.welcomeTextOpacity = new Animated.Value(1);
    this.textInputOpactiy = new Animated.Value(0);

    this.keyboardHeight = new Animated.Value(0);

    // this.welcomeTextHeight = new Animated.Value(this.getDimensions().topHeight);
    this.welcomeTextHeight = new Animated.Value(this.getDimensions().windowHeight);
    // this.textInputHeight = new Animated.Value(this.getDimensions().btmHeight);
    this.textInputHeight = new Animated.Value(0);

  }

  // Animation preparing
  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);

    setTimeout(() => {
      this.setState({
        showTextInput: true,
      })
    }, 1500);

  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.showTextInput === true) {
      return;
    }

    const duration = 700;

    Animated.sequence([

      // change height
      Animated.parallel([
        Animated.timing(this.welcomeTextHeight, {
          duration: duration,
          toValue: this.getDimensions().topHeight,
        }),
        Animated.timing(this.textInputHeight, {
          duration: duration,
          toValue: this.getDimensions().btmHeight,
        }),
      ]),

      // show the input
      Animated.timing(this.textInputOpactiy, {
        duration: duration,
        toValue: 1,
      })
    ]).start();

  }

  handleInput(text) {
    this.setState({
      username: text
    })
  }

  onSubmit() {
    if (this.state.username === '') {
      alert('Please give us a user name.')
      return;
    }
    this.props.whenSubmit(this.state.username)
  }

  render() {

    const titleText = "Bishop’s Community Fridge";
    const secondLine = "Welcome!";
    const inputTop = "You shall be known as";



    return (

      <Animated.View style={[Styles.container, { paddingBottom: this.keyboardHeight }]}>

        <Animated.View style={[Styles.welcomeTexts, { height: this.welcomeTextHeight }, { opacity: this.welcomeTextOpacity }]}>
          <Text style={Styles.text}>{titleText}</Text>
          <Text style={[Styles.text, { fontSize: 30 }, { padding: 30 }]}>{secondLine}</Text>
        </Animated.View>

        <Animated.View style={[Styles.textInput, { height: this.textInputHeight }, { opacity: this.textInputOpactiy }]}>

          <Text style={[Styles.text, { fontFamily: 'space-mono' }]}>{inputTop}</Text>

          <TextInput
            style={Styles.textbox}
            textContentType={'givenName'}
            onChangeText={(text) => this.handleInput(text)}
          />

          <TouchableOpacity onPress={() => this.onSubmit()}>
            <View style={Styles.submitBtn}>
              <Text style={{ color: '#fff', fontSize: 20 }}>Submit</Text>
            </View>
          </TouchableOpacity>

        </Animated.View>
      </Animated.View>

    );
  }

  _keyboardWillShow = (event) => {

    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height + 50,
      }),
      Animated.timing(this.welcomeTextOpacity, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.welcomeTextHeight, {
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
      Animated.timing(this.welcomeTextOpacity, {
        duration: event.duration,
        toValue: 1,
      }),
      Animated.timing(this.welcomeTextHeight, {
        duration: event.duration,
        toValue: this.getDimensions().topHeight,
      }),

    ]).start();

  }

  getDimensions = () => {
    const windowHeight = Dimensions.get('window').height;
    const topHeight = windowHeight / 1.8;

    return {
      windowHeight: windowHeight,
      topHeight: topHeight,
      btmHeight: windowHeight - topHeight
    }
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F2D7F',
    alignItems: 'center',
    justifyContent: 'center',

  },
  welcomeTexts: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  text: {
    color: '#fff',
    fontSize: 22,
  },
  invis: {
    display: "none"
  }
});