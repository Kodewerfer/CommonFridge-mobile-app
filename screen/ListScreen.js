import React, { Component } from 'react';
import { AppLoading } from 'expo';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
// react navigation
import { withMappedNavigationProps } from 'react-navigation-props-mapper';


@withMappedNavigationProps()
export class ListScreen extends Component {
  static navigationOptions = {
    title: 'Take Item',    
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isProcessing: false,
      itemList: null
    }
  }

  fetchList = async () => {

    const urlPrefix = 'http://ubishops-community-fridge.herokuapp.com';
    const fridgeID = '1';

    const listURL = urlPrefix + `/fridges/${fridgeID}/items`;

    try {

      let response = await fetch(
        listURL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );
      let responseJson = await response.json();

      this.setState({
        itemList: responseJson
      })

      return responseJson;

    } catch (error) {
      alert('load item list failed.')
      console.warn(error);
    }


  }

  componentWillMount = () => {
    this.fetchList();
  };

  deleteItem = async (rowData) => {

    if (this.state.isProcessing) {
      alert('Processing, please wait.')
      return;
    }

    this.setState({
      isProcessing: true
    })

    const urlPrefix = 'http://ubishops-community-fridge.herokuapp.com';
    const { id } = rowData.item
    const listURL = urlPrefix + `/items/${id}`;

    try {

      let response = await fetch(
        listURL, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'item_id': id,
            "user": {
              "name": this.props.username,
              "password": "424242"
            }
          })
        }
      );

      let responseJson = await response.json();

      let listResponse = await this.fetchList();

      if (await listResponse) {
        this.setState({
          isProcessing: false
        })
      }

      return responseJson;

    } catch (error) {

      this.setState({
        isProcessing: false
      })

      alert('failed, please try again.')
      // console.alert('failed, please try again.')
      console.warn(error);
    }

  }

  // DEPRECATED
  iterateList() {

    let result = [];

    for (let i of this.state.itemList) {

      result.push((
        <View key={i.id} style={Styles.items}>
          <View style={Styles.itemsInner}>{i.name}</View>
        </View>
      ));

    }

    return result;
  }

  render() {

    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.fetchList}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <View style={Styles.container}>

        <View style={Styles.textWrapper}>
          <Text style={[Styles.text, { fontSize: 30 }, { marginBottom: 10, }]}>Welcome, {this.props.username}</Text>
          <Text style={[Styles.text, { fontSize: 15, fontStyle: 'italic', fontWeight: '700' }]}>swipe right on the item to take it.</Text>
        </View>

        <View
          style={[Styles.container, {
            alignItems: 'stretch',
            justifyContent: 'center'
          }]}>

          <SwipeListView
            useFlatList={true}
            data={this.state.itemList ? this.state.itemList.slice() : null}

            keyExtractor={(rowData, index) => {
              return rowData.id.toString();
            }}

            renderItem={(rowData, rowMap) => (
              <View style={Styles.itemsInner}>
                <Text style={Styles.itemName}>{rowData.item.name}</Text>
              </View>
            )}

            renderHiddenItem={(rowData, rowMap) => (
              <View key={rowData.id} style={Styles.itemsContainer}>
                <TouchableHighlight onPress={() => this.deleteItem(rowData)} >
                  <View style={Styles.getBtn}>
                    <Text style={Styles.getBtnText}>Take</Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}
            stopLeftSwipe={85}
            leftOpenValue={85}
            disableLeftSwipe={true}
          />

        </View>

      </View >
    );
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}

const Styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#4F2D7F'
  },
  textWrapper: {
    padding: 10,
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  itemView: {
    flex: 2,
  },
  itemsContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 100,
    backgroundColor: "#7650aa",
  },
  itemsInner: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "#d6cee0",
    borderBottomWidth: 1,
  },
  itemName: {
    fontWeight: '600',
    fontFamily: 'space-mono',
    fontSize: 30,
    color: "#616161",
  },
  getBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 85,
    backgroundColor: '#54a3ff'
  },
  getBtnText: {
    fontWeight: '800',
    fontSize: 20,
    color: '#fff'
  },
  rowBack: {
    alignItems: 'center',
    // backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderBottomWidth: 1,
  },
  invis: {
    display: "none"
  }
});