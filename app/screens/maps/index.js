import React, { Component } from 'react';
import { 
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { NavigationActions } from "react-navigation";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import hotelsbydayApi from '../../api/hotelsbyday.js';
import googlemaps from '../../api/googlemaps.js';
import Styles from '../../commons/styles';
import { YellowBox } from 'react-native';
import moment from 'moment';

export default class Maps extends Component {

  constructor(props) {
    super(props);

    this.hotelsbyday = new hotelsbydayApi();
    this.googlemaps = new googlemaps();
    this.state = {
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
    };

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);

  };


  componentDidMount = () => {
    this.validLocationPermission();
  };

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
            alert("Permission Denied");
          }
        } catch (err) {
          alert("err",err);
          console.warn(err)
        }
      }
      requestLocationPermission();
    }
  };

  gpsCordenatesLoad = () => {
    var that =this;
    if( this.state.currentLatitude != 'unknown' && this.state.currentLongitude != 'unknown' ){
      this.getCurrentCity(this.state.currentLatitude, this.state.currentLongitude );
    }else{
      that.callLocation(that);
    }
  };


  gpsCordenatesUpdate = () => {
  
  };


  callLocation = (that) => {
    
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        that.setState({ currentLongitude:currentLongitude });
        that.setState({ currentLatitude:currentLatitude });

        //call funtion for gps coordenates
        this.gpsCordenatesUpdate();

      },
      (error) => {
        that.setState({ gpsError:true });
        that.setState({ gpsErrorMsg:error.message });
        that.setState({ loading: false });          
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );
    
    that.watchID = Geolocation.watchPosition((position) => {
      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);
      that.setState({ currentLongitude:currentLongitude });
      that.setState({ currentLatitude:currentLatitude });
      
      //call funtion for gps coordenates
      this.gpsCordenatesLoad();

    });
  };


  UNSAFE_componentWillReceiveProps = (nextProps) => {

    if(nextProps.navigation.state.params.location){

      if( nextProps.navigation.state.params.location != this.state.location ){
        this.setState({ 
          location: nextProps.navigation.state.params.location,
          loading: true,
          coordinates: [],
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
          mapRef: null,
          currentLocation: null,
          hotelDetail: false,
        }, () => {
          this.getHotelsByCity( this.state.location, this.state.dateArrival );
        });
      }
    }

    if(nextProps.navigation.state.params.currentLocation){
      if( nextProps.navigation.state.params.currentLocation == 'get' ){
        this.setState({ 
          loading: true,
          coordinates: [],
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


  UNSAFE_componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
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
        hotels: res._embedded.hotels,
        hotels_count: res.hotels_count,
      }, () => {
        this.state.hotels.map(item => (
          this.state.coordinates.push({ latitude: item.lat , longitude: item.lon })
        ));
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
        hotels: res._embedded.hotels,
        hotels_count: res.hotels_count,
      }, () => {
        this.state.hotels.map(item => (
          this.state.coordinates.push({ latitude: item.lat , longitude: item.lon })
        ));
        this.setState({ 
          location: null,
          loading: false 
        });
      });
    });
  };


  getCurrentCity = (lat, lon) => {
    this.getHotelsByGeo( lat, lon, this.state.dateArrival );
    this.googlemaps.getCityByGeoLocation(lat, lon).then( res => {
      this.setState({ 
        currentLocation: res.results[0].formatted_address,
      });
    });
  };


  getSearchMsg = () => {
    if(this.state.location==null){
      return 'Getting location and searching hotels, wait...';
    }else{
      return 'Searching available hotels, please wait...';
    }
  };


  getLocationName = ( prefix=true ) => {

    if(this.state.location==null && this.state.currentLocation==null){
      return `Current location`;
    }else{
      
      if(this.state.location==null && this.state.currentLocation!=null) {
        return `${ this.state.currentLocation }`;
      }else{
        return (prefix) ? `City: ${ this.state.location }` : `${ this.state.location }`;
      }
    
    };
    
  };


  goToHotelDescription = ( hotelId ) => {

    this.props.navigation.navigate('hotelDetail', {
      hotelDetailUrl: `http://www.demo.hotelsbyday.com/en/hotels/1/1/${hotelId}?inapp=true&reactApp=1&date=${moment( this.state.dateArrival ).format('MMM D, Y')}`,
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
      </View>
    )
  };
  

  renderMarkers = (items) => {
    return(      
      <Marker 
        key={ items.id }
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
                <Text key={index} style={{ fontSize: 12 }} >
                  <Icon color={ room.rate_type=='non-refundable' ? 'red' : '#58543B' } size={14} name={Platform.OS === "ios" ? "ios-card" : "md-card"} />
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
          provider={provider}
          style={{ alignSelf: 'stretch', height: '100%' }}
          ref={(ref) => { this.state.mapRef = ref }}
          onLayout = {() => this.state.mapRef.fitToCoordinates(this.state.coordinates, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
        >
          {hotels.map(items => (
            this.renderMarkers(items)
          ))}
        </MapView>
      )
    }else{
      return(
        <MapView
          provider={provider}
          style={{ alignSelf: 'stretch', height: '100%' }}
          initialRegion={{
            latitude: this.state.hotels[0].lat,
            longitude: this.state.hotels[0].lon,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}
        > 
          {hotels.map(item => (
            this.renderMarkers(item)
          ))}
        </MapView>
      )
    }
  };


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
          <Text>{ this.getSearchMsg() }</Text>
          <ActivityIndicator />
        </View>
      );
    };


    if(this.state.hotels_count == 0){
      return (
        <View style={[container, centerAll]}>
          { this.renderBarButtons( this.state.dateArrival, container, centerAll, backgroundColor, mapsSearchbuttons, fontColorGreen, mapsSearchbuttonsTxt ) }
          <View style={[container, centerAll]}>
            <Text style={{ margin:20, }}>No hotels found, please choose another location or change your arrival date...</Text>
          </View>
        </View>
      );
    }else{
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
        </View>
      );
    };  

    
  }


}