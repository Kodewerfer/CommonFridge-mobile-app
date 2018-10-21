import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Camera, Permissions } from 'expo';

export class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isAbleToSnap: true
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  async takeSnap() {
    if (!this.camera || !this.state.isAbleToSnap) {
      return;
    }

    let that = this

    this.camera.takePictureAsync({ quality: 0.3, skipProcessing: true, base64: true }).then(
      (photo) => {
        this.props.afterTakingPhoto(photo);
        this.props.toggleCamera();
      },
      () => {
        that.setState({
          isAbleToSnap: true
        })
      });


    this.setState({
      isAbleToSnap: false
    })
  }



  onFlipCamera() {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }

  render() {

    const { hasCameraPermission } = this.state;

    const ableToSnap = this.state.isAbleToSnap;

    const snapBG = ableToSnap ? Styles.snapBtnBG : Styles.snapBtnBGDis;
    const isAlertShows = ableToSnap ? { display: 'none' } : '';
    const snapBtnOpacity = ableToSnap ? 0.2 : 1;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (

        <View style={Styles.fullScreen}>
          <Camera ref={(ref) => this.camera = ref} style={Styles.fullScreen} type={this.state.type}>

            <View
              style={Styles.actionBar}>

              <TouchableOpacity
                style={Styles.flipBtn}
                onPress={() => this.props.toggleCamera()}
              >
                <Text
                  style={Styles.flipBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.snapBtn}
                onPress={() => this.takeSnap()}
                activeOpacity={snapBtnOpacity}
              >
                <Text style={[Styles.alertText, isAlertShows]}>Please Hold...</Text>
                <View style={snapBG}>
                  <Icon name="camera" style={Styles.snapIcon} size={40} color="#fff" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.flipBtn}
                onPress={() => this.onFlipCamera()}>
                <Text
                  style={Styles.flipBtnText}>
                  Flip
                </Text>
              </TouchableOpacity>

            </View>
          </Camera>
        </View >

      );
    }
  }


}


const Styles = StyleSheet.create({
  fullScreen: {
    flex: 1
  },
  actionBar: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  flipBtn: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  flipBtnText: {
    fontSize: 20,
    paddingBottom: 35,
    paddingTop: 20,
    color: 'white'
  },
  snapBtn: {
    flex: 3,
    paddingBottom: 40,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  snapBtnBG: {
    backgroundColor: '#4F2D7F',
    borderRadius: 50,
  },
  snapBtnBGDis: {
    backgroundColor: '#ccc',
    borderRadius: 50,
  },
  snapIcon: {
    padding: 20,
    color: 'white'
  },
  alertText: {
    color: '#fff',
    backgroundColor: '#4F2D7F',
    padding: 20,
    fontSize: 15,
    marginBottom: 15,
    alignSelf: 'center'
  }
});
