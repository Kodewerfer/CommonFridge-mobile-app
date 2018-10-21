import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';

export class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {

    const titleText = "Bishop’s Community Fridge";
    const secondLine = "Welcome! " + this.props.username;


    return (

      <View style={styles.container}>

        <View style={styles.welcomeTexts}>
          <Text style={styles.text}>{titleText}</Text>
          <Text style={[styles.text, { fontSize: 30 }, { padding: 30 }]}>{secondLine}</Text>
        </View>

        <TouchableOpacity onPress={() => this.onSubmit()}>
          <View style={styles.submitBtn}>
            <Text style={{ color: '#fff', fontSize: 15 }}>Submit</Text>
          </View>
        </TouchableOpacity>

      </View>

    );
  }
}

const styles = StyleSheet.create({
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