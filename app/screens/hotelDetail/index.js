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

export default class HotelDetail extends Component {

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
      hotelDetailUrl: this.props.navigation.state.params.hotelDetailUrl,
    };
  }

  ActivityIndicatorLoadingView = () => {
    return (
      <View style={{ flex:1, position: 'absolute',left: 0,right: 0, top: 0,bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
        <ActivityIndicator color="#009688" />
        <Text style={{ color: '#fff' }} >Loading</Text>
      </View>
    );
  };

  render() {
    
    

    return (

      <WebView
        style={[ container, centerAll ]}
        source={{ uri: this.state.hotelDetailUrl }}
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