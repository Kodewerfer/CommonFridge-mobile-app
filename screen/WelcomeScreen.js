import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';

export class WelcomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNameInput: false,
      username: '',
      isNameEmpty: true
    }

    setTimeout(() => {
      this.setState({
        showNameInput: true
      })
    }, 2500);
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

    const inputStyle = this.state.showNameInput ? Styles.textInput : Styles.invis;

    return (

      <View style={Styles.container}>

        <View style={Styles.welcomeTexts}>
          <Text style={Styles.text}>{titleText}</Text>
          <Text style={[Styles.text, { fontSize: 30 }, { padding: 30 }]}>{secondLine}</Text>
        </View>

        <KeyboardAvoidingView behavior="padding" enabled style={inputStyle}>

          <Text style={[Styles.text, { fontFamily: 'space-mono' }]}>{inputTop}</Text>

          <TextInput
            style={Styles.textbox}
            textContentType={'givenName'}
            onChangeText={(text) => this.handleInput(text)}
            onSubmitEditing={() => this.onSubmit()}
          />

          <TouchableOpacity onPress={() => this.onSubmit()}>
            <View style={Styles.submitBtn}>
              <Text style={{ color: '#fff', fontSize: 15 }}>Submit</Text>
            </View>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </View>

    );
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
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