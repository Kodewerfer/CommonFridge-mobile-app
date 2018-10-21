import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, Image, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';

export class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }

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

  render() {

    const secondLine = "Welcome! " + this.props.username;

    return (


      <View style={Styles.container}>

        <View style={Styles.containerInner}>

          <View style={Styles.containerTop}>

            <Text style={[Styles.text, { fontSize: 30 }, { padding: 30 }]}>{secondLine}</Text>

          </View>

          <View style={Styles.containerMid}>
            <TouchableOpacity onPress={() => this.props.toggleCamera()}>
              {this.renderCenter()}
            </TouchableOpacity>
          </View>

          <View style={Styles.containerBtm}>
            <Text style={[Styles.text, { fontSize: 30 }, { padding: 30 }]}>{secondLine}</Text>
          </View>




        </View>

      </View>

    );
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8ECC2',
  },
  imgPort: {
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
  containerTop: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  containerMid: {
    flex: 2,
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