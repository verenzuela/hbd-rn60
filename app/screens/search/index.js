import React, { Component } from 'react';
import { 
  Text,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert, 
  TouchableOpacity,
} from 'react-native';
import Styles from '../../commons/styles';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import hotelsbydayApi from '../../api/hotelsbyday.js';
import moment from 'moment';

let calendarDate = moment();

const {
  container, 
  centerAll,
  iconColor,
  fontColorGreen,
  borderColor,
  backgroundColor,
  backgroundColorLight,
  searchCont,
  searchTxtInput,
  searchTxtStyle,
  searchBtn,
  searchBtnCurrentLocation,
} = Styles;

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.hotelsbyday = new hotelsbydayApi();
    this.state = {
      loading: false,
      changeType: this.props.changeType,
      citiesList: [],
      calendarDate: calendarDate.format('YYYY-MM-DD'),
      horizontal: false,
    };
    this.arrayholder = []; 
  }

  componentDidMount(){
    if(this.state.changeType == 'city'){
      this.setState({
        loading: true,
      }, () => {
        this.getCities();
      });
    }
  };

  currentlocation = () => {
    this.props.navigation.navigate('Home', {
      currentLocation: 'get',
    });
  };

  changeCity = (cityName) => {
    if(cityName!=null){
      this.props.navigation.navigate('Home', {
        location: cityName,
        currentLocation: '',
      });
    }
  };

  changeDate = (date) => {
    this.props.navigation.navigate('Home', {
      dateArrival: date,
      currentLocation: '',
    });
  };

  getCities = () => {
    this.hotelsbyday.getCities().then( res => {
      this.setState({
        loading: false,
        citiesList: res.data,
      },
        function() {
          this.arrayholder = res.data;
        }
      );
    });
  };

  
  onDayPress = (date) => {
    this.changeDate(date);
  };


  onCityPress = (city) => {
    if(city != ''){
      this.changeCity(city);
    }    
  };


  getCityByLocation = () => {
    this.currentlocation();
  };


  SearchFilterFunction(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.value ? item.value.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      citiesList: newData,
      text: text,
    });
  }

  renderItem = (item, index) => {

    let mod = index % 2;

    return (
      <TouchableOpacity style={[ (mod == 0 ) ? backgroundColorLight : '', {flex: 1, flexDirection: 'row',}]} onPress={_ => this.onCityPress( item.value )} >
        <Text style={[fontColorGreen, searchTxtStyle]}>{ item.value }</Text>
      </TouchableOpacity>
    );
  };






  render() {
    
    if(this.state.loading){
      return (
        <View style={[container, centerAll]}>
          <Text>Loading city list, wait...</Text>
          <ActivityIndicator />
        </View>
      );
    }


    if(this.state.changeType == 'city'){
      return (
        <View style={searchCont}>
          <TextInput
            style={[searchTxtInput, borderColor]}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Type the city here"
          />
          
          <FlatList
            data={this.state.citiesList}
            renderItem={({ item, index }) => (

              this.renderItem(item, index) 
              

            )}
            enableEmptySections={true}
            style={{ marginTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={ centerAll } >
            <Text style={[ searchTxtStyle, { fontWeight: 'bold' } ]}> OR </Text>
          </View>

          <View style={[ backgroundColor, borderColor, searchBtnCurrentLocation ]}>
            <TouchableOpacity style={{flex: 1, flexDirection: 'row',}} onPress={_ => this.getCityByLocation()} >
              <View style={{ justifyContent: 'center', alignItems: 'center', }}> 
                <Text style={{ color: 'white', fontSize: 16, alignItems: 'center', textAlign: 'center' }} >
                  GET YOUR CITY BY CURRENT LOCATION
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      );
    }


    if(this.state.changeType == 'date'){
      return (
        <View style={{ flex: 1 }}>
          <Calendar
            current={this.state.calendarDate}
            headerData={{
              calendarDate: calendarDate.format('DD MMM, YYYY')
            }}
            style={{
              paddingLeft: 10, paddingRight: 10
            }}
            horizontal={this.state.horizontal}
            onDayPress={this.onDayPress}
          />
        </View>
      );
    }
    
    
    return(
      <View style={[container, centerAll]}>
        <Text> Change { this.state.changeType } </Text>
      </View>
    )

  }
}

