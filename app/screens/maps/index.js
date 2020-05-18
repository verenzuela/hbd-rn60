import React, { Component } from 'react';
import { 
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { BackHandler, Dimensions, Animated } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { NavigationActions } from "react-navigation";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import hotelsbydayApi from '../../api/hotelsbyday.js';
import googlemaps from '../../api/googlemaps.js';
import Styles from '../../commons/styles';
import { YellowBox } from 'react-native';
import moment from 'moment';
import url from '../../commons/base_urls.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient';

import {
  PacmanIndicator
} from 'react-native-indicators';

let {width, height} = Dimensions.get('window');

export default class Maps extends Component {

  state = {
    backClickCount: 0
  };

  constructor(props) {
    super(props);

    this.handleBackButton = this.handleBackButton.bind(this);
    this.springValue = new Animated.Value(600);

    this.hbdUrl = url.hbd_url;
    this.hotelsbyday = new hotelsbydayApi();
    this.googlemaps = new googlemaps();
    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      initialGeo: [],
      lastGeo: [],
      status: false,
      networkError: false,
      location: this.props.location,
      dateArrival: this.props.dateArrival,
      hotels: [],
      hotels_count: 0,
      loading: true,
      coordinates: [],
      mapRef: null,
      currentLatitude: 'unknown',
      currentLongitude: 'unknown',
      gpsError: false,
      gpsErrorMsg: null,
      currentLocation: null,
      hotelDetail: false,  
      hotelDetailUrl: '',
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
      switchValue:false,
    };

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);

  };

  toggleSwitch = (value) => {
      this.setState({switchValue: value})
  }

  componentDidMount(){

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    NetInfo.isConnected.addEventListener('change', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { 
        this.setState({ status: isConnected }, () => {
          if(this.state.status){
            this.validLocationPermission();  
          }else{
            //error conection
            Alert("Network error....");
          }
        });
      }
    );
  };

  componentWillUnmount() {

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    this.hbdUrl = null;
    this.hotelsbyday = null;
    this.googlemaps = null;

    NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
    
    this.watchID != null && Geolocation.clearWatch(this.watchID);
    
    this.setState({ 
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      initialGeo: [],
      lastGeo: [],
      status: false,
      networkError: false,
      location: null,
      dateArrival: null,
      hotels: [],
      hotels_count: 0,
      loading: true,
      coordinates: [],
      mapRef: null,
      currentLatitude: 'unknown',
      currentLongitude: 'unknown',
      gpsError: false,
      gpsErrorMsg: null,
      currentLocation: null,
      hotelDetail: false,  
      hotelDetailUrl: '',
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    })
  };

  
  _spring() {
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(
          this.springValue,
          {
            toValue: -.15 * height,
            friction: 10,
            duration: 300,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          this.springValue,
          {
            toValue: 100,
            duration: 1500,
            useNativeDriver: true,
          }
        ),
      ]).start(() => {
          this.setState({backClickCount: 0});
      });
    });
  };

  handleBackButton = () => {
    this._spring();
    return true;
  } 


  validLocationPermission = () =>{
    var that =this;
    if(Platform.OS === 'ios'){
      this.callLocation(that);
    }else{
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.callLocation(that);
          } else {
            Alert("Permission Denied");
          }
        } catch (err) {
          Alert("err",err);
        }
      }
      requestLocationPermission();
    }
  };


  callLocation = (that) => {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position.coords);
        
        this.setState({
          initialPosition: initialPosition,
          initialGeo: position.coords,
        }, () => {
          this._loadData();
        });
      },
      error => error = 1, //Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position.coords)
      this.setState({
        lastPosition: lastPosition,
        lastGeo: position.coords,
      }, () => {
        this._loadData();
      });
    });
  };


  _loadData = () => {
    if( this.state.initialPosition == 'unknown' && this.state.lastPosition == 'unknown' ){
      this.setState({ 
        //loading: false,
      });
    }else{
      if( this.state.initialPosition != 'unknown' && this.state.lastPosition == 'unknown' ){
        this.setState({ 
          geodata: 'initial',
          currentLatitude: JSON.stringify(this.state.initialGeo.latitude),
          currentLongitude: JSON.stringify(this.state.initialGeo.longitude),
        }, () => {
          this.getCurrentCity(this.state.currentLatitude, this.state.currentLongitude );
        });
      }
      if( this.state.initialPosition == 'unknown' && this.state.lastPosition != 'unknown' ){
        this.setState({ 
          geodata: 'last',
          currentLatitude: JSON.stringify(this.state.lastGeo.latitude),
          currentLongitude: JSON.stringify(this.state.lastGeo.longitude),
        }, () => {
          this.getCurrentCity(this.state.currentLatitude, this.state.currentLongitude );
        });
      }
    }
  };


  componentWillReceiveProps = (nextProps) => {

    if(nextProps.navigation.state.params.location){
      if( nextProps.navigation.state.params.location != this.state.location ){
        this.setState({ 
          location: nextProps.navigation.state.params.location,
          loading: true,
          coordinates: [],
          hotels: [],
          mapRef: null,
          currentLocation: null,
          hotelDetail: false,
        }, () => {
          this.getHotelsByCity( this.state.location, this.state.dateArrival );
        });
      }
    }
    
    if(nextProps.navigation.state.params.dateArrival){
      if( nextProps.navigation.state.params.dateArrival.dateString != this.state.dateArrival ){
        this.setState({ 
          dateArrival: nextProps.navigation.state.params.dateArrival.dateString,
          loading: true,
          coordinates: [],
          hotels: [],
          mapRef: null,
          //currentLocation: null,
          hotelDetail: false,
        }, () => {
          if( this.state.location != null ){
            this.getHotelsByCity( this.state.location, this.state.dateArrival );  
          }else{
            this.getHotelsByGeo(this.state.currentLatitude, this.state.currentLongitude, this.state.dateArrival );
          }        
        });
      }
    }

    if(nextProps.navigation.state.params.currentLocation){
      if( nextProps.navigation.state.params.currentLocation == 'get' ){
        this.setState({ 
          loading: true,
          coordinates: [],
          hotels: [],
          mapRef: null,
          currentLocation: null,
          location: null,
          hotelDetail: false,
        }, () => {
          //this.validLocationPermission();
          this.getCurrentCity(this.state.currentLatitude, this.state.currentLongitude );

        });
      }
    }

  };


  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
  };

  onRegionChange = (region) => {
    this.setState({ region });
  }; 


  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };


  getHotelsByCity = (cityName, date) => {
    this.hotelsbyday.getHotelsByCity(cityName, date).then( res => {
      this.setState({
        hotels_count: res.data.hotels_count,
        coordinates: res.data._embedded.lat_lon,
        hotels: res.data._embedded.hotels,
      }, () => {
        this.setState({ 
          location: cityName,
          loading: false,
          currentLocation: null,
        });
      });
    });
  };


  getHotelsByGeo = (lat, lon, date) => {
    this.hotelsbyday.getHotelsByGeo(lat, lon, date).then( res => {
      this.setState({
        hotels_count: res.data.hotels_count,
        coordinates: res.data._embedded.lat_lon,
        hotels: res.data._embedded.hotels,
      }, () => {        
        this.setState({ 
          location: null,
          loading: false 
        });
      });
    });
  };


  getCurrentCity = (lat, lon) => {
    this.googlemaps.getCityByGeoLocation(lat, lon).then( res => {
      if(res.data == ''){
        if(res.error == 'Network request failed'){
          this.setState({ 
            networkError: true,
          });
        }
      }else{
        this.setState({ 
          currentLocation: res.data.results[0].formatted_address,
        }, () => {
          this.getHotelsByGeo( lat, lon, this.state.dateArrival );
        });
      }  
    });
  };


  getSearchMsg = () => {
    if(this.state.location==null){
      return 'Searching for nearby hotels, please hang tight!';
    }else{
      return 'Searching available hotels, please wait...';
    }
  };


  getLocationName = ( prefix=true ) => {
    if(this.state.location==null && this.state.currentLocation==null){
      return `Current Location`;
    }else{
      if(this.state.location==null && this.state.currentLocation!=null) {
        //return `${ this.state.currentLocation }`;
        return `Current Location`;
      }else{
        return (prefix) ? `City: ${ this.state.location }` : `${ this.state.location }`;
      }
    };
  };


  goToHotelDescription = ( hotelId ) => {
    this.props.navigation.navigate('hotelDetail', {
      hotelDetailUrl: `${this.hbdUrl}en/hotels/1/1/${hotelId}?inapp=true&soapp=${ (Platform.OS==='ios') ? 'ios' : 'android' }&reactApp=1&date=${moment( this.state.dateArrival ).format('MMM D, Y')}`,
    });
  }


  renderBarButtons = ( dateArrival, container, centerAll, backgroundColor, mapsSearchbuttons, fontColorGreen, mapsSearchbuttonsTxt) => {
    return(
      <View style={[ centerAll, backgroundColor, { width:'100%', height: 60, flexDirection: 'row' } ]}>
        <View style={[container ]}>
          <TouchableOpacity style={[ mapsSearchbuttons ]} onPress={ this.navigateToScreen('Search') } >
            <View style={[container, centerAll]}>
              <Text allowFontScaling={false} style={[ mapsSearchbuttonsTxt, fontColorGreen ]}>{ this.getLocationName(false) }</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[container ]}>
          <TouchableOpacity style={[ mapsSearchbuttons, ]} onPress={ this.navigateToScreen('Date') } >
            <View style={[container, centerAll]}>
              <Text allowFontScaling={false} style={[ mapsSearchbuttonsTxt, fontColorGreen ]}> { moment( dateArrival ).format('MMM D, Y')}  </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[container ]}>
          <View style={[ mapsSearchbuttons, ]} >
            <View style={[container, centerAll, { flexDirection: 'row' }  ]}>
              <Text>List</Text>
              <Switch
                onValueChange = {this.toggleSwitch}
                value = {this.state.switchValue}
              />
              <Text>Map</Text>
            </View>
          </View>
        </View>
      </View>
    )
  };
  

  renderMarkers = (items,index) => {
    return(      
      <Marker 
        key={ index+'-'+items.id }
        coordinate={{ latitude: items.lat , longitude: items.lon }}
      > 
        <View style={{ backgroundColor: '#2E5C65', borderColor: '#f5f5f2', borderWidth: 0.3, padding:2, borderRadius: 4, }} >
          <View style={{ borderColor: '#f5f5f2', borderWidth: 0.2, borderRadius: 3, padding:4, }}>
            <Text style={{ color: '#f5f5f2', fontWeight: 'bold' }} >{`${items.discounted_price} ${items.currency}`}</Text>
          </View> 
        </View>
        <Callout 
          tooltip={false} 
          onPress={() => this.goToHotelDescription(items.id)}
        >
          <View style={{ width: 270 }} >

              <Text style={{ fontSize: 14, fontWeight: 'bold' }} >{items.name}</Text>
              {items.rooms.map( (room,index) => (      
                <Text key={room.id + '-' + room.rate_type} style={{ fontSize: 12 }} >
                  <MaterialCommunityIcons color={ room.rate_type=='non-refundable' ? 'red' : '#58543B' } size={14} name={ room.rate_type=='non-refundable' ? "credit-card" : "credit-card-off"} />
                  <Text> &nbsp; </Text>
                  <Text >
                    {`${room.name} at ${room.discounted_price}${items.currency}. From ${moment(room.offer_date_from).format('hA')} - ${moment(room.offer_date_to).format('hA')} `}  
                  </Text>
                </Text>
              ))}

          </View>
        </Callout>
      </Marker>
    )
  };


  renderMap = ( hotels, provider ) => {
    if( this.state.hotels_count > 1 ){
        return( 
          <MapView
            loadingEnabled={true}
            provider={provider}
            style={{ alignSelf: 'stretch', height: '100%' }}
            ref={(ref) => { this.state.mapRef = ref }}
            onLayout = {() => this.state.mapRef.fitToCoordinates(this.state.coordinates, { edgePadding: { top: 20, right: 20, bottom: 20, left: 20 }, animated: false })}
          >
            {hotels.map( (items,index) => (
              this.renderMarkers(items,index)
            ))}
          </MapView>
        )
    }else{
      return(
        <MapView
          loadingEnabled={true}
          provider={provider}
          style={{ alignSelf: 'stretch', height: '100%' }}
          initialRegion={{
            latitude: this.state.hotels[0].lat,
            longitude: this.state.hotels[0].lon,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
        > 
          {hotels.map( (items,index) => (
            this.renderMarkers(items,index)
          ))}
        </MapView>
      )
    }
  };

  getImage = (urlImage) => {
    return imageSource = urlImage.replace('{x}', '200').replace('{y}', '200');
  };

  renderList = ( hotels, container, centerAll, borderColor, fontColorGreen ) => {
    return( 

      hotels.map( (items,index) => (
        
        <View key={ index } style={[ centerAll, borderColor, { width:'97%', height: 100, flexDirection: 'row', margin:5, borderWidth:1, } ]}>
          <View style={[ container, centerAll ]}>

            <Image
              style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
              source={{uri: `${this.getImage(items.image_url)}` }}
              
            />

          </View>
          <View style={{ flex:2 }}>
            <Text style={[ fontColorGreen, { fontSize: RFPercentage(1.8), marginLeft: 5, fontWeight: 'bold', }]} >{ items.name }</Text>
            <Text style={[ fontColorGreen, { fontSize: RFPercentage(1.5), marginLeft: 5, }]}>{ items.address_line_1 }</Text>
            <Text style={[ fontColorGreen, { fontSize: RFPercentage(1.5), marginLeft: 5, }]}>{ items.address_line_2 }</Text>
          </View>
          
          <View style={[ container, centerAll ]}>
            <Text style={[ centerAll, fontColorGreen, { textAlign: 'center', fontSize: RFPercentage(1.6) }]} >{` ${moment(items.offer_date_time_from).format('hA')} - ${moment(items.offer_date_time_to).format('hA')} `}</Text>
          </View>
          
          <View style={[ container, centerAll ]}>
          <Text>{` From: `}</Text>
            <Text style={[ fontColorGreen ]}>{` ${items.discounted_price} ${items.currency} `}</Text>

            <TouchableOpacity onPress={() => this.goToHotelDescription(items.id)}>
              
              <LinearGradient colors={['#f4be50', '#f7dfa5', '#f4be50']} 
                style={{ 
                  width:70, 
                  height:30, 
                  borderWidth:1, 
                  marginTop: 5, 
                  borderRadius:2,
                  borderColor: '#9c7e31',
                }}
              >
                <View style={[ container, centerAll ]}>
                  <Text>
                    Select
                  </Text>  
                </View>
              </LinearGradient>

            </TouchableOpacity>

            

          </View>
        </View>

      ))

    )
  };



  renderExitText = () => {
    return (
      <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => BackHandler.exitApp()}
        >
          <Text style={styles.exitText}>Tap here to exit the app</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }



  renderTextFoundBar = ( hotels ) => {
    if( this.state.hotels_count > 1 ){
      return(
         `${this.state.hotels_count} Hotels available for day use rooms in ${this.getLocationName(false)}`
      )
    }else{
      return(
         `${this.state.hotels_count} Hotel available for day use rooms in ${this.getLocationName(false)}`
      )
    }
  };
  

  render() {
  
    const {
      container, 
      centerAll,
      iconColor,
      borderColor,
      backgroundColor,
      mapsSearchbuttons,
      backgroundColorLight,
      fontColorGreen,
      mapsSearchbuttonsTxt,
      fontSizeResponsive,
    } = Styles;

    
    if(this.state.loading){
      return (
        <View style={[container, centerAll]}>
          <PacmanIndicator color='#2E5C65' size={60}  />
          {/*<Text>{ this.getSearchMsg() }</Text>*/}
        </View>
      );
    };


    if(this.state.networkError){
      return (
        <View style={[container, centerAll]}>
          <View style={[container, centerAll]}>
            <Text style={{ margin:20, }}>Network request failed.</Text>
          </View>

          { this.renderExitText() }

        </View>
      );
    }else{

      if(this.state.hotels_count == 0){
        return (
          <View style={[container, centerAll]}>
            { this.renderBarButtons( this.state.dateArrival, container, centerAll, backgroundColor, mapsSearchbuttons, fontColorGreen, mapsSearchbuttonsTxt ) }
            <View style={[container, centerAll]}>
              <Text >No hotels found, please choose another location</Text>
              <Text >or change your arrival date...</Text>
            </View>

            { this.renderExitText() }

          </View>
        );
      }else{

        if(this.state.switchValue){
          return (
            <View style={[container]}>
              { this.renderBarButtons( this.state.dateArrival, container, centerAll, backgroundColor, mapsSearchbuttons, fontColorGreen, mapsSearchbuttonsTxt ) }
              <View style={[container]}>
                { this.renderMap( this.state.hotels, PROVIDER_GOOGLE  ) }
              </View>
              <View style={[ centerAll, { borderTopWidth: 0.3, borderColor: 'grey', width:'100%', height: 40, flexDirection: 'row' } ]}>
                <View style={[container, { padding: 5, } ]}>
                  <Text allowFontScaling={false} style={[ fontSizeResponsive ]} > { this.renderTextFoundBar(this.state.hotels) } </Text>
                </View>
              </View>

              { this.renderExitText() }

            </View>
          );  
        }else{
          return (
            <View style={[container]}>
              { this.renderBarButtons( this.state.dateArrival, container, centerAll, backgroundColor, mapsSearchbuttons, fontColorGreen, mapsSearchbuttonsTxt ) }
              <View style={[container]}>

                <SafeAreaView style={{ flex: 1, }}>
                  <ScrollView>
                    
                    { this.renderList( this.state.hotels, container, centerAll, borderColor ) }  
                    
                  </ScrollView>
                </SafeAreaView>

                
              </View>
              <View style={[ centerAll, { borderTopWidth: 0.3, borderColor: 'grey', width:'100%', height: 40, flexDirection: 'row' } ]}>
                <View style={[container, { padding: 5, } ]}>
                  <Text allowFontScaling={false} style={[ fontSizeResponsive ]} > { this.renderTextFoundBar(this.state.hotels) } </Text>
                </View>
              </View>

              { this.renderExitText() }

            </View>
          );
        }

        
      };

    }

      

    
  }


}



const styles = {
    animatedView: {
        width,
        backgroundColor: "#0a5386",
        elevation: 2,
        position: "absolute",
        bottom: 0,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    exitText: {
        color: "yellow",
        paddingHorizontal: 10,
        paddingVertical: 3
    }
};