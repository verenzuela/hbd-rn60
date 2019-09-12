import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../../commons/styles';

const {
  container, 
  centerAll,
  iconColor,
  borderColor,
} = Styles;

export default class HelpDesk extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <View style={style.iconContainer}>
          <TouchableOpacity style={[style.touchable, { paddingLeft:10 }]} onPress={ () => navigation.goBack() } >
            <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"} style={iconColor} size={30} />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  ActivityIndicatorLoadingView = () => {
    return (
      <ActivityIndicator
        color="#009688"
        style = {{position: 'absolute',left: 0,right: 0, top: 0,bottom: 0,alignItems: 'center',justifyContent: 'center'}}
      />
    );
  };

  render() {
    
    

    return (

      <WebView
        style={[ container, centerAll ]}
        source={{ uri: 'https://hotelsbyday.zendesk.com/hc/en-us/requests/new' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        renderLoading={ this.ActivityIndicatorLoadingView }
        startInLoadingState={true}
      />
        
    );
  }

}

const style = StyleSheet.create({
  
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 80
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
  },
});