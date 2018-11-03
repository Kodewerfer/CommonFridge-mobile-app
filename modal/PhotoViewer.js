import React, { Component } from 'react';

import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

@withMappedNavigationProps()
export class PhotoViewer extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const props = this.props;

    return (
      <TouchableOpacity
        style={Styles.container}
        onPress={() => props.navigation.goBack()}>

        <Image source={{ uri: props.itemPhoto.uri }} style={Styles.imgView} />


      </TouchableOpacity>

    );
  }
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