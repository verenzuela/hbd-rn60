import React, { Component } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  LayoutAnimation, 
  UIManager, 
  Platform, 
  Image,
  AsyncStorage,
} from 'react-native';
import { NavigationActions } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../../commons/styles';

export default class Sidebar extends Component {

  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {

    };
  }


  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    };
  };


  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };


  componentDidMount(){

  };
  
  
  render() {

    const {
      container, 
      iconColor,
      borderColor,
      sidebarTopHeigthHeaderLogo,
      sidebarHeaderLogo,
      sidebarClose,
      sidebarNavBarItemHeader,
      sidebarNavBarItemCont,
      sidebarNavBarImg,
      sidebarNavBarItemTxt,
      sidebarIconSize,
      sidebarFooterCont,
      sidebarFooterIcons,
    } = Styles;

    return (
      <View style={container}>
        
        <View style={ sidebarTopHeigthHeaderLogo }>
          <View style={[ sidebarHeaderLogo, borderColor ]} >
            <TouchableOpacity style={{ height: 60, width: '80%', }} onPress={ this.navigateToScreen('Home') } >
              <Image
                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                source={ require('../../assets/png/HBD_logo_color.png') }
                resizeMode="contain"
                resizeMethod="resize"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView>

          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('Home') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-pin" : "md-pin"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>Home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('Search') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-search" : "md-search"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>Change City</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('Date') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>Change Date</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('support') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-call" : "md-call"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>Contact Us</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('How') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-construct" : "md-construct"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>How It Works</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('profile') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-person" : "md-person"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>Profile</Text>
            </View>
          </TouchableOpacity>


          {/*
          <TouchableOpacity activeOpacity={0.8} style={sidebarNavBarItemHeader} onPress={ this.navigateToScreen('about') } >
            <View style={sidebarNavBarItemCont}>
              <View style={sidebarNavBarImg}>
                <Text><Icon style={[iconColor, sidebarIconSize]} name={Platform.OS === "ios" ? "ios-information-circle" : "md-information-circle"} /></Text>
              </View>
              <Text style={sidebarNavBarItemTxt}>About Us</Text>
            </View>
          </TouchableOpacity>
          */}
          
        </ScrollView>

        {/*
        <View style={sidebarFooterCont}>
          <View style={sidebarFooterIcons}>
            <Icon style={[ iconColor, sidebarIconSize, { marginRight:10 }]} name="logo-facebook" />
            <Icon style={[ iconColor, sidebarIconSize, { marginRight:10 }]} name="logo-twitter" />
            <Icon style={[ iconColor, sidebarIconSize, { marginRight:10 }]} name="logo-linkedin" />
            <Icon style={[ iconColor, sidebarIconSize, { marginRight:10 }]} name="logo-instagram" />
            <Icon style={[ iconColor, sidebarIconSize, { marginRight:10 }]} name="logo-youtube" />
          </View>
        </View>
        */}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text></Text>
        </View>
        
      </View>
    );
  }
}
