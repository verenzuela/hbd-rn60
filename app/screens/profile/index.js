import React, { Component } from 'react';
import { 
  View, 
  Text,
  YellowBox,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Picker,
  StyleSheet,
} from 'react-native';
import { BackHandler } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Communications from 'react-native-communications';
import Table from 'react-native-simple-table'
import { NavigationActions } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import loyaltyApi from '../../api/loyalty.js';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Styles from '../../commons/styles';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import Dialog, {
  DialogTitle,
  DialogContent,
  dialogAnimation,
  SlideAnimation
} from 'react-native-popup-dialog';

const width = Dimensions.get('window').width;
const {
      container, 
      centerAll,
      iconColor,
      borderColor,
      tabBar,
      tabBarItem,
      backgroundColorLight,
      tabBarItemSelected,
      iconColorWhite,
      fontColorGreen,
      backgroundColor,
      tapContent,
      tapTitle,
      tapLineText,
      tapTextPill,
      bgColorBronze,
      bgColorSilver,
      bgColorGold,

      profileInput,

      searchBtnCurrentLocation,


    } = Styles;


const columnsBookings = [
  {
    title: '#',
    dataIndex: 'number',
    width: 80
  },
  {
    title: 'Hotel',
    dataIndex: 'hotel_name',
    width: 140
  },
  {
    title: 'City',
    dataIndex: 'city_name',
    width: 90
  },
  {
    title: 'Arrival date',
    dataIndex: 'arrival_date',
    width: 80
  },
];


const columnsFavorites = [
  {
    title: 'Hotel',
    dataIndex: 'hotel_name',
    width: 180
  },
  {
    title: 'City',
    dataIndex: 'city_name',
    width: 120
  },
  {
    title: 'Bookings',
    dataIndex: 'bookings_count',
    width: 90
  },
];


export default class Profile extends Component {

  constructor(props) {
    super(props);
    
    this.loyalty = new loyaltyApi();

    this.date = new Date().getDate(); 
    this.month = new Date().getMonth() + 1; 
    this.year = new Date().getFullYear();

    this.state = {
      isLogin: '',
      tap_selected: 'dashboard',
      today: this.month+'-'+this.date+'-'+this.year,
      bookings: [],
      favorites: [],
      profile: [],
      loyalty: [],

      
      firstname: false,
      lastname: false,
      gender: false,
      date: false,
      phone: false,
      email: false,
      postal_code: false,
      fflayer: false,
      profession: false,

      isIata: false,
      travel_iata: false,
      travel_iataid: false,
      travel_email: false,
      travel_phone: false,
      travel_name: false,
      travel_agency: false,

      slideAnimationDialogOnSaveData: false,

      current_password:'', 
      new_password:'', 
      confirm_password:'',
    };
  }


  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this._validateGuestUser();
    this.getBookings();
    this.getFavorites();
    this.getProfile();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    this.setState({ 
      isLogin: '',
      tap_selected: 'dashboard',
      bookings: [],
      favorites: [],
    });
  };


  handleBackButton = () => {
    this.props.navigation.navigate('Home');
    return true;
  }
  
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };
  

  _logout = async () => {
    await AsyncStorage.removeItem('_isGuest');
    await AsyncStorage.removeItem('_isLogin', () => {
      this.props.navigation.navigate('login', {
        login: true
      });
    });
  };


  _validateGuestUser = async () => {
    const isGuestUser = await AsyncStorage.getItem('_isGuest');

    if (isGuestUser=='isGuest') {
      this.props.navigation.navigate('login', {
        login: true
      });
    }else{

      this.loyalty.isLogin().then( res => {
        if(!res.data.response){
          this._logout();
        }else{
          this.setState({
            isLogin: 'logged'
          });
        };
        
      });
    };
  };


  updatePassword = () => {

    let password = (this.state.current_password!='') ? this.state.current_password : '';
    let newPassword = (this.state.new_password!='') ? this.state.new_password : '';

    if(password==''){
      Alert.alert('Error', 'Enter your current password', [{ text: 'Close' }]);
      return false;
    }

    if(newPassword != this.state.confirm_password){
      Alert.alert('Error', 'New password and confirmation do not match', [{ text: 'Close' }]);
      return false;
    }

    if(newPassword.length < 8 ){
      Alert.alert('Error', 'New password must have at least 8 characters', [{ text: 'Close' }]);
      return false;
    }


    this.setState({ 'slideAnimationDialogOnSaveData' : true });

    this.loyalty.passwordUpdate( this.state.current_password, this.state.new_password, this.state.confirm_password ).then( res => {
      this.setState({ 'slideAnimationDialogOnSaveData' : false });
    
      if(res.data.response){
        Alert.alert('Data updated', res.data.msg, [{ text: 'Close' }]);
      }else{
        Alert.alert('Error', res.data.msg, [{ text: 'Close' }]);
      };
    });

  }


  updateProfile = () => {

    let formatDate = Moment(this.state.date, 'MM-DD-YYYY');

    this.setState({ 
      'slideAnimationDialogOnSaveData' : true,
    }, () => {

      this.loyalty.profileUpdate(
        this.state.firstname,  
        this.state.lastname, 
        this.state.gender, 
        Moment(formatDate).format('DD-MM-YYYY'),
        this.state.phone, 
        this.state.postal_code, 
        this.state.fflayer, 
        this.state.profession, 
        this.state.travel_iata, 
        this.state.travel_iataid, 
        this.state.travel_email, 
        this.state.travel_phone, 
        this.state.travel_name, 
        this.state.travel_agency
      ).then( res => {
        this.setState({ 'slideAnimationDialogOnSaveData' : false });
      
        if(res.data.response){
          Alert.alert('Data updated', res.data.msg, [{ text: 'Close' }]);

          this.getProfile();

        }else{
          Alert.alert('Error', res.data.msg, [{ text: 'Close' }]);
        };
      });

    });

  }

  getProfile = () => {
    this.loyalty.profile().then( res => {
      if(res.data.response=='true'){
        this.setState({
          profile: res.data.data.user,
          loyalty: res.data.data.loyalty,
          firstname: res.data.data.user.firstname,
          lastname: res.data.data.user.lastname,
          gender: res.data.data.user.gender,
          phone: res.data.data.user.phone,
          email: res.data.data.user.email,
          postal_code: res.data.data.user.postal_code,
          fflayer: res.data.data.user.fflayer,
          profession: res.data.data.user.profession,
          travel_iata: res.data.data.user.travel_iata,
          travel_iataid: res.data.data.user.travel_iataid,
          travel_email: res.data.data.user.travel_email,
          travel_phone: res.data.data.user.travel_phone,
          travel_name: res.data.data.user.travel_name,
          travel_agency: res.data.data.user.travel_agency,
        });

        if(res.data.data.user.date){
          this.setState({ 'date' : Moment(res.data.data.user.date).format('MM-DD-YYYY') });
        }else{
          this.setState({ 'date' : this.state.today });
        }

        if(this.state.travel_iataid){
         this.setState({ 'isIata' : true });
        }

      }
    });
  };


  getBookings = () => {
    this.loyalty.bookings().then( res => {
      if(res.data.response=='true'){
        this.setState({
          bookings: res.data.data 
        });
      }
    });
  };


  getFavorites = () => {
    this.loyalty.favorites().then( res => {
      if(res.data.response=='true'){
        this.setState({
          favorites: res.data.data 
        });
      }
    });
  };


  renderTapContent( tap ){

    if (tap === 'dashboard') {
      return this.tapDashboard();
    } else if (tap === 'profile') {
      return this.tapProfile();
    } else if (tap === 'bookings') {
      return this.tapBookings();
    } else if (tap === 'password') {
      return this.tapPassword();
    } else if (tap === 'favorites') {
      return this.tapFavorites();
    }

  };


  tapChange = ( tap ) => {
    this.setState({ tap_selected: tap });
  };


  isWinner = () => {
    if( this.state.loyalty.is_winer ){
      return (
        <View style={[ tapLineText ]}>
          <Text style={{ marginBottom: 10, fontSize: 0.050*width, }} >Congratulations!!! </Text>
          <Text style={{ fontSize: 0.050*width, fontWeight: 'bold', color:'green' }} >You won a free day stay, </Text>
          <Text style={{ marginBottom: 10, fontSize: 0.050*width, }} > our team will contact you soon. </Text>
        </View>
      );
    };
  };

  freeStayPendingPoints = () => {
    if(this.state.loyalty.free_stay_pending_points){
      return(
        <View style={[ tapLineText ]}>
          <Text style={[ fontColorGreen, backgroundColor, tapTextPill, { fontSize: 0.025*width }]} >{ this.state.loyalty.free_stay_pending_points }</Text>
          <Text style={[ fontColorGreen, { marginBottom: 10, fontSize: 0.025*width }]} > points left to your next free day stay </Text>
        </View>
      );
    };
  };


  poinstPending = () => {
    if(this.state.loyalty.poinst_pending){
      return (
        <View style={[ tapLineText ]}>
          <Text style={{ marginBottom: 10, fontSize: 0.022*width, color:'red' }} >You have pending </Text>
          <Text style={[ tapTextPill, { fontSize: 0.022*width, backgroundColor:'red' }]} >{ this.state.loyalty.poinst_pending }</Text>
          <Text style={{ marginBottom: 10, fontSize: 0.022*width, color:'red' }} > points. ( points will be credited 1 day past your check-out time ) </Text>
        </View>
      );
    };
  };

  renderIsIata = () => {
    if(this.state.isIata){
      return (
        <View>
          <View style={{ flexDirection:'row', height:45  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', marginRight:'2%', }]} placeholder='IATA, CLIA, Arc, Tico' autoCapitalize="none" 
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('travel_iata', val)} value={this.state.travel_iata}
            />
            <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', }]} placeholder='Agent E-mail' autoCapitalize="none"
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('travel_email', val)} value={this.state.travel_email}
            />
          </View>
          <View style={{ flexDirection:'row', height:45  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', marginRight:'2%', }]} placeholder='Agent name' autoCapitalize="none" 
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('travel_name', val)} value={this.state.travel_name}
            />
            <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', }]} placeholder='Agent phone' autoCapitalize="none"
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('travel_phone', val)} value={this.state.travel_phone}
            />
          </View>
          <View style={{ flexDirection:'row', height:45  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '101%', }]} placeholder='Agency name' autoCapitalize="none" 
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('travel_agency', val)} value={this.state.travel_agency}
            />
          </View>  
        </View>
      )
    }else{
      return (
        <View></View>
      )
    }
  };


  profileIsIncomplete = () => {
    if( !this.state.loyalty.profile_complete){
      return (
        <View style={[ tapLineText ]}>
          <Text style={{ marginBottom: 10, fontSize: 0.022*width, color:'red' }} >Complete your profile and get 1 free point.</Text>
        </View>
      )
    }
  }

  levelColor = () => {
    if( this.state.loyalty.level == 'Bronze' ){
      return bgColorBronze;
    }
    if( this.state.loyalty.level == 'Silver' ){
      return bgColorSilver;
    }
    if( this.state.loyalty.level == 'Gold' ){
      return bgColorGold;
    }
  };


  checkBoxSelect = () => {
    let isIata;
    if(this.state.isIata){
      isIata = false;
    }else{
      isIata = true;

      if(!this.state.travel_iataid){
        this.setState({ travel_iataid: 'yes' });
      }

    } 
    this.setState({ isIata: isIata });

    //this.setState((prevState) => ({ isIata: !prevState.check }));
  };

  tapDashboard = () => {
    return (
      <View style={[ tapContent ]}>
        <Text style={[ tapTitle ]} >Dashboard:</Text>

        { this.profileIsIncomplete() }

        <View style={[ tapLineText ]}>
          <Text style={{ fontSize: 0.050*width, }} >You are at </Text>
          <Text style={[ tapTextPill, this.levelColor(), { fontSize: 0.050*width }]} >{ this.state.loyalty.level }</Text>
        </View>

        { this.isWinner() }

        <View style={[ tapLineText ]}>
          <Text style={{ marginBottom: 10, fontSize: 0.050*width, }} >You have accumulated </Text>
          <Text style={[ tapTextPill, this.levelColor(), { fontSize: 0.050*width }]} >{ this.state.loyalty.points_accumulated }</Text>
          <Text style={{ marginBottom: 10, fontSize: 0.050*width, }} > points </Text>
        </View>
        
        { this.freeStayPendingPoints() }

        { this.poinstPending() }

        <View style={{ borderBottomColor: '#000', borderBottomWidth: 2, width:'100%', marginTop:10, marginBottom:20 }} />
        
        <View style={[ tapLineText ]}>
          <Text style={{ fontSize: 0.030*width, }} >How to earn </Text>
          <Text style={{ fontSize: 0.030*width, fontWeight:'bold' }} > FREE DAY STAYS </Text>
          <Text style={{ fontSize: 0.030*width, }} > with HotelsByDay? </Text>
        </View>

        <View style={[ tapLineText ]}>
          <Text style={[ tapTextPill, bgColorBronze, { fontSize: 0.022*width, width:45 }]} >Bronze</Text>
          <Text style={{ fontSize: 0.022*width, }} > 1 booking = 1 point. @ 20 points, you </Text>
          <Text style={{ fontSize: 0.022*width, fontWeight:'bold' }} > get a free day stay </Text>
          <Text style={{ fontSize: 0.022*width, }} > + move to Silver level. </Text>
        </View>

        <View style={[ tapLineText ]}>
          <Text style={[ tapTextPill, bgColorSilver, { fontSize: 0.022*width, width:45 }]} >Silver</Text>
          <Text style={{ fontSize: 0.022*width, }} > 1 booking = 2 point. @ 20 points, you </Text>
          <Text style={{ fontSize: 0.022*width, fontWeight:'bold' }} > get a free day stay </Text>
          <Text style={{ fontSize: 0.022*width, }} > + move to Gold level. </Text>
        </View>

        <View style={[ tapLineText ]}>
          <Text style={[ tapTextPill, bgColorGold, { fontSize: 0.022*width, width:45 }]} >Gold</Text>
          <Text style={{ fontSize: 0.022*width, }} > 1 booking = 4 point. @ 20 points, you </Text>
          <Text style={{ fontSize: 0.022*width, fontWeight:'bold' }} > get a free day stay. </Text>
        </View>

      </View>
    );
  }


  tapProfile = () => {
    return (
      <View style={[ tapContent ]}>
        <Text style={[ tapTitle ]} >Profile:</Text>

        <View style={{ flexDirection:'row', height:45  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', marginRight:'2%', }]} placeholder='Firstname' autoCapitalize="none"
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('firstname', val)} value={this.state.firstname}
            />
            <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', }]} placeholder='Lastname' autoCapitalize="none" 
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('lastname', val)} value={this.state.lastname}
            />
        </View>

        <View style={{ flexDirection:'row', height:45  }}>
          <Picker
            style={[ backgroundColorLight, { width: "50%", marginRight:'2%', height: 40 }]}
            mode="dropdown"
            itemStyle={{height: 40}}
            selectedValue={this.state.gender}
            onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}
          > 
            <Picker.Item color='grey' label="Gender" value="" />
            <Picker.Item label="Female" value="felame" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          
          <DatePicker
            style={[ backgroundColorLight, { height: 40, width: '49%', marginBottom: 20, }]}
            mode="date" //The enum of date, datetime and time
            date={ this.state.date }
            placeholder=" Birth date"
            format="MM-DD-YYYY"
            minDate="01-01-1909"
            maxDate={this.state.today}
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            showIcon={false}
            onDateChange={(date) => {this.setState({date: date})}}
            customStyles={{
              dateInput:{
                borderWidth: 0,                        
                borderColor: 'grey',
                alignItems: 'flex-start',
              },
              dateText:{
                fontSize: 16,
                color: 'black',
                textAlign: "left",
              },
              placeholderText: {
                fontSize: 16,
                color: 'grey'
              }
            }}
          />
        </View>


        <View style={{ flexDirection:'row', height:45  }}>
          <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', marginRight:'2%', }]} placeholder='Phone' autoCapitalize="none" 
            placeholderTextColor='grey' onChangeText={val => this.onChangeText('phone', val)} value={this.state.phone}
          />
          <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', }]} placeholder='Email' autoCapitalize="none" editable = {false}
            placeholderTextColor='grey' onChangeText={val => this.onChangeText('email', val)} value={this.state.email}
          />
        </View>

        <View style={{ flexDirection:'row', height:45  }}>
          <TextInput style={[ profileInput, backgroundColorLight, { width: '49%', marginRight:'2%', }]} placeholder='Zip Code' autoCapitalize="none" 
            placeholderTextColor='grey' onChangeText={val => this.onChangeText('postal_code', val)} value={this.state.postal_code}
          />
          <Picker
            style={[ backgroundColorLight, { width: "49%", height: 40 }]}
            mode="dropdown"
            itemStyle={{height: 40}}
            selectedValue={this.state.fflayer}
            onValueChange={(itemValue, itemIndex) => this.setState({fflayer: itemValue})}
          >
            <Picker.Item color='grey' label="Frequent flyer?" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
        </View>

        <View style={{ flexDirection:'row', height:45  }}>
          <TextInput style={[ profileInput, backgroundColorLight, { width: '101%', }]} placeholder='Profession' autoCapitalize="none" 
            placeholderTextColor='grey' onChangeText={val => this.onChangeText('profession', val)} value={this.state.profession}
          />
        </View>


        <View style={{ flexDirection:'row', height:45  }}>
          <CheckBox
            value={this.state.isIata}
            onChange={ () => this.checkBoxSelect() }
          />
          <Text style={{marginTop: 5}}> I'm a travel agent with IATA, CLIA, Arc, or Tico number </Text>
        </View>

        <View style={[ tapLineText ]}>
          <Text >
            <Text style={{ fontSize: 0.030*width, }} >Travel Agents qualify for commissions instead of loyalty points. For any additional questions on Travel Agent partnerships, please contact us at </Text>
            <Text style={[ fontColorGreen, { fontSize: 0.030*width }]} onPress={() => Communications.email(['partnerships@hotelsbyday.com'],null,null,'Contact from the app','') } >partnerships@hotelsbyday.com </Text>
          </Text>
        </View>

        { this.renderIsIata() }

        <TouchableOpacity onPress={_ => this.updateProfile() } style={{flex: 1, flexDirection: 'row',}}  >
          <View style={[ centerAll,  backgroundColor, borderColor, {color:'white', height:40, width:'100%' } ]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}> 
              <Text style={{ color: 'white', fontSize: 16, alignItems: 'center', textAlign: 'center' }} >
                SAVE
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={[ tapLineText ]}>
          <Text>
            <Text style={{ fontSize: 0.030*width, }} >Email address cannot be changed. If you wish to make a modification, please contact us at</Text>
            <Text style={[ fontColorGreen, { fontSize: 0.030*width }]} onPress={() => Communications.email(['frontdesk@hotelsbyday.com'],null,null,'Contact from the app','') }> frontdesk@hotelsbyday.com </Text>
            <Text style={{ fontSize: 0.030*width, }} >with the request  </Text>
          </Text>
        </View>

      </View>
    );
  }


  tapBookings = () => {
    return (
      <View style={[ tapContent ]}>
        <Text style={[ tapTitle ]} >Bookings:</Text>
        <View>
          <Table height={520} columnWidth={60} columns={columnsBookings} dataSource={this.state.bookings} />
        </View>
      </View>
    );
  }


  tapPassword = () => {
    return (
      <View style={[ tapContent ]}>
        <Text style={[ tapTitle ]} >Change Password:</Text>

        <View style={{ flexDirection:'row', height:50  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '100%', marginRight:'2%', }]} placeholder='Current password' autoCapitalize="none"
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('current_password', val)} value={this.state.current_password} secureTextEntry={true}
            />
        </View>

        <View style={{ flexDirection:'row', height:50  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '100%', marginRight:'2%', }]} placeholder='New password' autoCapitalize="none"
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('new_password', val)} value={this.state.new_password} secureTextEntry={true}
            />
        </View>

        <View style={{ flexDirection:'row', height:50  }}>
            <TextInput style={[ profileInput, backgroundColorLight, { width: '100%', marginRight:'2%', }]} placeholder='Repeat new password' autoCapitalize="none"
              placeholderTextColor='grey' onChangeText={val => this.onChangeText('confirm_password', val)} value={this.state.confirm_password} secureTextEntry={true}
            />
        </View>
        
        <TouchableOpacity onPress={_ => this.updatePassword() } style={{flex: 1, flexDirection: 'row',}}  >
          <View style={[ centerAll,  backgroundColor, borderColor, {color:'white', height:40, width:'100%' } ]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}> 
              <Text style={{ color: 'white', fontSize: 16, alignItems: 'center', textAlign: 'center' }} >
                SET PASSWORD
              </Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    );
  }


  tapFavorites = () => {
    return (
      <View style={[ tapContent ]}>
        <Text style={[ tapTitle ]} >Favorites:</Text>

        <View>
          <Table height={520} columnWidth={60} columns={columnsFavorites} dataSource={this.state.favorites} />
        </View>
        
      </View>
    );
  }


  render() {
    
    if(this.state.isLogin=='logged'){

      return (
        <View style={[container]}>

          <Dialog
            visible={ this.state.slideAnimationDialogOnSaveData }
            dialogTitle={<DialogTitle title="Updating data." />}
            dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}>
            <DialogContent>
              <Text>
                Please wait...
              </Text>
            </DialogContent>
          </Dialog>

          <View style={{ flex:1, marginTop: 10, marginBottom: 10 }}>

            <View style={[ tabBar, borderColor ]} >

              <TouchableOpacity style={[ tabBarItem, borderColor, ( this.state.tap_selected === 'dashboard') ? tabBarItemSelected : '' ]} onPress={ () => this.tapChange('dashboard') } >
                <View style={[container, centerAll]} >
                  <MaterialCommunityIcons style={[ ( this.state.tap_selected === 'dashboard') ? iconColorWhite : iconColor ]} size={40} name={'view-dashboard-variant'} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[ tabBarItem, borderColor, ( this.state.tap_selected === 'profile') ? tabBarItemSelected : '' ]} onPress={ () => this.tapChange('profile') } >
                <View style={[container, centerAll]} >
                  <MaterialCommunityIcons style={[ ( this.state.tap_selected === 'profile') ? iconColorWhite : iconColor ]} size={40} name={'face-profile'} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[ tabBarItem, borderColor, ( this.state.tap_selected === 'bookings') ? tabBarItemSelected : '' ]} onPress={ () => this.tapChange('bookings') } >
                <View style={[container, centerAll]} >
                  <MaterialCommunityIcons style={[ ( this.state.tap_selected === 'bookings') ? iconColorWhite : iconColor ]} size={40} name={'bag-personal'} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[ tabBarItem, borderColor, ( this.state.tap_selected === 'password') ? tabBarItemSelected : '' ]} onPress={ () => this.tapChange('password') } >
                <View style={[container, centerAll]} >
                  <MaterialCommunityIcons style={[ ( this.state.tap_selected === 'password') ? iconColorWhite : iconColor ]} size={40} name={'shield-key'} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[ tabBarItem, borderColor, ( this.state.tap_selected === 'favorites') ? tabBarItemSelected : '', { borderRightWidth: 1 } ]} onPress={ () => this.tapChange('favorites') } >
                <View style={[container, centerAll]} >
                  <MaterialCommunityIcons style={[ ( this.state.tap_selected === 'favorites') ? iconColorWhite : iconColor ]} size={40} name={'star-box'} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView>
              { this.renderTapContent(
                  this.state.tap_selected
                ) 
              }
            </ScrollView>
            
            <TouchableOpacity style={[ (Platform.OS==='ios') ? styles.logoutIos : '' ,{ height:10, width:'100%' }]} onPress={_ => this._logout('about') } >
              <View style={[container, centerAll ]} >
                <Text >Logout</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>
      );

    }else{

      return (
        <View style={[container, centerAll]}>
          <View ><Text >Loading...</Text></View>
        </View>
      );

    }

  }
}


const styles = {
    logoutIos: {
      marginBottom: 30,
    },

}