import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';


export function PhotoViewer(props) {
  return (
    <TouchableOpacity style={Styles.container}
      onPress={() => props.togglePhotoView()}>

      <Image source={{ uri: props.itemPhoto.uri }} style={Styles.imgView}/>


    </TouchableOpacity>

  );
}


const Styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: '#616161',
    fontSize: 22,
  },
  imgView: {
    width: "100%",
    height: "100%"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});