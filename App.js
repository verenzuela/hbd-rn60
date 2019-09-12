import React, { Component } from 'react';
import { 
  Dimensions, 
  Platform, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
} from 'react-native';

import { 
  createSwitchNavigator, 
  createAppContainer,
  DrawerActions,
} from 'react-navigation';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Icon from 'react-native-vector-icons/Ionicons';
import CustomSidebarMenu from './app/components/sidebar';

import Maps from './app/screens/maps';
import Search from './app/screens/search';
import Support from './app/screens/support';
import HowItWorks from './app/screens/how';
import About from './app/screens/about';
import HelpDesk from './app/screens/helpDesk';
import HotelDetail from './app/screens/hotelDetail';

import moment from 'moment';

let date = moment(new Date()).add(1,'days');

class App extends Component {
  render() {
    return <AppContainer />;
  }
}
export default App;

const HomeTabNavigator = createBottomTabNavigator(
  { 
    Home: { 
      screen: props => <Maps {...props} location={null} dateArrival={date.format('YYYY-MM-DD')} />,
      navigationOptions: {
        title: 'Home',
      },
    },

    Search: { 
      screen : props => <Search {...props} changeType={'city'} />,
      navigationOptions: {
        title: 'Change City',
      },
    },

    Date: { 
      screen: props => <Search {...props} changeType={'date'} />,
      navigationOptions: {
        title: 'Change Date',
      },
    },

    How: { 
      screen: HowItWorks,
      navigationOptions: {
        title: 'How It Works',
      },
    },

  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      let titleName;
      titleName = routeName;

      if(routeName=='Home') titleName = 'HotelsByDay';
      if(routeName=='Search') titleName = 'Finding hotels by city';
      if(routeName=='Date') titleName = 'Change arrival date';
      if(routeName=='About') titleName = 'About HotelsByDay';
      if(routeName=='How') titleName = 'How It Works';
      
      return {
        headerTitle: titleName,
        headerStyle: { backgroundColor: '#f5f5f2' },
        headerTintColor: '#2E5C65',
      };
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = Platform.OS === "ios" ? 'ios-pin' : 'md-pin';
        } else if (routeName === 'Search') {
          iconName = Platform.OS === "ios" ? 'ios-search' : 'md-search';
        } else if (routeName === 'Date') {
          iconName = Platform.OS === "ios" ? 'ios-calendar' : 'md-calendar';
        } else if (routeName === 'How') {
          iconName = Platform.OS === "ios" ? 'ios-construct' : 'md-construct';
        }
        return <Icon name={iconName} name={iconName} size={25} color={tintColor} />;
      },
      tabBarOptions: { activeTintColor:'#2E5C65', }
    })
  }
);

const HomeStackNavigator = createStackNavigator(
  { 
    HomeTabNavigator:  { screen: HomeTabNavigator },
    support: { 
      screen: Support,
      navigationOptions: () => ({
        title: 'Contact Us',
        headerBackTitle: null,
        headerStyle: { backgroundColor: '#f5f5f2' },
        headerTintColor: '#2E5C65',
      })
    },
    about: { 
      screen: About,
      navigationOptions: () => ({
        title: 'About Us',
        headerBackTitle: null,
        headerStyle: { backgroundColor: '#f5f5f2' },
        headerTintColor: '#2E5C65',
      })
    },
    helpDesk: { 
      screen: HelpDesk,
      navigationOptions: () => ({
        title: 'Help Desk',
        headerBackTitle: null,
        headerStyle: { backgroundColor: '#f5f5f2' },
        headerTintColor: '#2E5C65',
      })
    },
    hotelDetail: { 
      screen: HotelDetail,
      navigationOptions: () => ({
        title: 'HotelsByDay',
        headerBackTitle: null,
        headerStyle: { backgroundColor: '#f5f5f2' },
        headerTintColor: '#2E5C65',
      })
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <TouchableOpacity style={[style.touchable, { paddingLeft:10 }]} onPress={() => navigation.toggleDrawer()} >
            <Icon name={Platform.OS === "ios" ? "ios-menu" : "md-menu"} color='#2E5C65' size={30}  />
          </TouchableOpacity>
        ),
        headerRight: (
          <Image
            style={{ height: 35, width: 35, marginRight: 10, }}
            source={ require('./app/assets/png/HBD_logo_color_small.png') }
          />
        ),
        headerStyle: { backgroundColor: '#2E5C65' },
        headerTintColor: '#fff',
      };
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    home: { screen: HomeStackNavigator }
  },
  { 
    contentComponent: props => (<CustomSidebarMenu navigation={props.navigation} drawerProps={{...props}} pressClose={() => props.navigation.dispatch(DrawerActions.closeDrawer())} />),
    drawerWidth: Dimensions.get('window').width - 130,
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  home: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(AppSwitchNavigator);

const style = StyleSheet.create({
  touchable: {
    flex: 1,
    flexDirection: 'row',
  }
});