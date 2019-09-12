import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Styles from '../../commons/styles';

export default class How extends Component {
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
    
    const {
      container, 
      centerAll,
      iconColor,
      borderColor,
    } = Styles;

    return (

      <WebView
        style={[ container, centerAll ]}
        //Loading URL
        source={{ uri: 'http://www.demo.hotelsbyday.com/en/new_howitworks' }}
        //Enable Javascript support
        javaScriptEnabled={true}
        //For the Cache
        domStorageEnabled={true}
        //View to show while loading the webpage
        renderLoading={ this.ActivityIndicatorLoadingView }
        //Want to show the view or not
        startInLoadingState={true}
      />
        
    );
  }

}