import React, { Component } from 'react';
import { StyleSheet, Text, View , TextInput, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Styles from '../../commons/styles';
import Communications from 'react-native-communications';
import { NavigationActions } from "react-navigation";

export default class Support extends Component {
  

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  onRegionChange(region) {
    this.setState({ region });
  }
  render() {
    
    const {
      container, 
      centerAll,
      iconColor,
      fontColorGreen,
      borderColor,
    } = Styles;

    return (

      <View style={container}>
        
        <View style={{ flex: 1, padding:20 }}>

          <View style={container}>

            <TouchableOpacity onPress={() => Communications.phonecall('+19179946284', true)}>
              <View>
                <Text style={{ fontSize: 22 }} >
                  <Icon size={22} style={iconColor} name={Platform.OS === "ios" ? "ios-phone-portrait" : "md-phone-portrait"} />
                  <Text> &nbsp; </Text>
                  <Text style={{ textDecorationLine: 'underline', color: 'blue'  }}>
                  +1.917.994.6284
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Communications.email(['frontdesk@hotelsbyday.com'],null,null,'Contact from the app','') }>
              <View>
                <Text style={{ fontSize: 22 }} >
                  <Icon size={22} style={iconColor} name={Platform.OS === "ios" ? "ios-at" : "md-at"} />
                  <Text> &nbsp; </Text>
                  <Text style={{ textDecorationLine: 'underline', color: 'blue'  }}>
                  frontdesk@hotelsbyday.com
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            <Text> &nbsp; </Text>
            <Text> &nbsp; </Text>

            <Text style={[ fontColorGreen, { fontSize: 22, fontWeight: 'bold' }]} >
              HotelsByDay
            </Text>
            <Text style={{ fontSize: 18 }} >
              545 Fifth Avenue, Suite #640
            </Text>
            <Text style={{ fontSize: 18 }} >
              New York, NY 10017
            </Text>
            <Text style={{ fontSize: 18 }} >
              U.S.A.
            </Text>

          </View>

        </View>

        <View style={[ container, centerAll, { padding:20 }]}>
          
                    
            <View style={[container, centerAll]}>
              <TouchableOpacity activeOpacity={0.8} onPress={ this.navigateToScreen('helpDesk') } >
                <Text style={{ fontSize: 22 }} >
                  <Text style={[ fontColorGreen ]} >Contact us on our </Text>
                  <Text style={{ textDecorationLine: 'underline', color: 'blue'  }} >helpdesk!</Text>
                </Text>
              </TouchableOpacity>
            </View>
          

          <View style={[container]}>
            <Image
              style={{ height: 80, width: 200, resizeMode: 'contain' }}
              source={ require('../../assets/png/HBD_logo_color.png') }
              resizeMode="contain"
              resizeMethod="resize"
            />

          </View>

        </View>

      </View>

      
    );
  }

}

const styles = StyleSheet.create({
  map: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
});
