import React, { Component } from 'react';
import { 
  View, 
  Text,
  YellowBox,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { BackHandler, Dimensions, Animated } from 'react-native';
import { NavigationActions } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import loyaltyApi from '../../api/loyalty.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Styles from '../../commons/styles';
import url from '../../commons/base_urls.js';

import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import firebase from 'react-native-firebase';
import LinkedInModal from 'react-native-linkedin';

let {width, height} = Dimensions.get('window');

export default class Login extends Component {
  
  state = {
    backClickCount: 0
  };

  constructor(props) {
    super(props);

    this.goToRegisterPage = this.goToRegisterPage.bind(this);
    this.hbdUrl = url.hbd_url;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.springValue = new Animated.Value(600);

    this.loyalty = new loyaltyApi();
    this.state = {
      username: "",
      password: "",
      loading: false,
      validateLogin: false,
      login: this.props.login,
    };

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);

  };



  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.setState({ 
        login: false,
    }, () => {
      this._validateGuestUser();
    });      
  };


  componentWillUnmount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.setState({ 
      username: "",
      password: "",
      loading: true,
      validateLogin: false,
      login: false,
    });

    if (this._storeData) { this._storeData.cancel(); }
    if (this._validateGuestUser) { this._validateGuestUser.cancel(); }
    if (this.googleLogin) { this.googleLogin.cancel(); }

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
  };


  googleLogin = async () => {
    try {
      
      // add any configuration settings here:
      await GoogleSignin.configure({
        webClientId: '908843177748-361uir7i1gdcd2ioj5tj3cfjs2supcjq.apps.googleusercontent.com',
        forceConsentPrompt: true, 
      });

      const data = await GoogleSignin.signIn();

      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

      dataUser = firebaseUserCredential.user.toJSON();
      email = dataUser.providerData[0].email;
      uid = dataUser.providerData[0].uid;
      displayName = dataUser.providerData[0].displayName;
      type = 'google';

      this._signInSocial(type, uid, email, displayName);
      
    } catch (e) {
      //console.warn(e);
    }
  };


  goToRegisterPage = () => {
    Linking.openURL(this.hbdUrl+'en?action=sign-in').catch(err => console.error("Couldn't load page", err));
  };


  _signInSocial = (type, id, email, displayName) => {
    if( type == '' || id == ''){
      Alert.alert('Error', 'User not found', [{
        text: 'Close'
      }]);
    }else{
      this.setState({
        loading: true, 
      }, () => {

        this.loyalty.loginSocial(type, id, email, displayName).then( res => {

          if(res.data.response==true){
            
            this._storeData('_isGuest', '');
            this._storeData('_isLogin', 'login');
            this._storeData('_email', email);
            this.navigateToScreen('Home');

          }else{

            this._storeData('_isGuest', '');
            this._storeData('_isLogin', '');
            this._storeData('_email', '');

            this.setState({
              loading: false, 
              login: true, 
            }, () => {

              if(res.data.msg=='Login fail, user not found'){
                Alert.alert(
                  'Alert', 'You do not have a valid #MasterKey account. Please create one in our website www.hotelsbyday.com and try again', 
                  [
                    { text: 'Close' },
                    { text: 'Go to register page', onPress: () => this.goToRegisterPage()},
                  ]
                );  
              }else{
                Alert.alert('Error', res.data.msg, [{ text: 'Close' }]);  
              }

            });

          }

        });
           
      });
      
    }
  }


  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    };
  };


  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  
  _goAsGuest = () => {
    this._storeData('_isGuest', 'isGuest');
    this.navigateToScreen('Home');
  };


  _validateGuestUser = async () => {
    const isGuestUser = await AsyncStorage.getItem('_isGuest');
    const isLogin = await AsyncStorage.getItem('_isLogin');

    if (isGuestUser=='isGuest') {
      this._goAsGuest();
    }else{
      if (isLogin=='login') {
        this.navigateToScreen('Home');    
      }else{
        this.setState({ login:true });  
      };
    };
  };

  
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.navigation.state.params.login){
      if( nextProps.navigation.state.params.login == true ){
        this.setState({ 
          username: "",
          password: "",
          loading: false,
          validateLogin: false,
          login:nextProps.navigation.state.params.login
        });
      }
    };
  };


  _signIn = () => {
    const { username, password } = this.state;
    
    if( username == '' || password == ''){
      Alert.alert('Error', 'Username or Password can\'t be blank', [{
        text: 'Close'
      }]);
    }else{
      this.setState({
        loading: true, 
      }, () => {

        this.loyalty.login(username, password).then( res => {

          if(res.data.response==true){
            
            this._storeData('_isGuest', '');
            this._storeData('_isLogin', 'login');
            this._storeData('_email', username);
            this.navigateToScreen('Home');

          }else{

            this._storeData('_isGuest', '');
            this._storeData('_isLogin', '');
            this._storeData('_email', '');

            this.setState({
              loading: false, 
              login: true, 
            }, () => {
              Alert.alert('Error', res.data.msg, [{ text: 'Close' }]);
            });

          }

        });
           
      });
      
    }
  };



  render() {
    
    const renderButton = () => {
      return (
        <TouchableOpacity style={ linkedinButton } 
          onPress={() => this.modal.open()}
        >
                  
            <View style={[container, centerAll, { flexDirection: 'row', }]}>
              <View style={socialButtonIcon}>
                <Text><MaterialCommunityIcons color={ '#fff' } size={25} name={'linkedin-box'} /></Text>
              </View>
              <Text allowFontScaling={false} style={ googleButtonTxt }> Login with Linkedin </Text>              
            </View>
        </TouchableOpacity>
      );
    };


    const {
      container, 
      centerAll,
      iconColor,
      borderColor,
      searchTxtInput,
      borderWidth,
      mapsSearchbuttons,
      mapsSearchbuttonsTxt,
      fontColorGreen,
      linkedinButton,
      linkedinButtonTxt,
      googleButton,
      googleButtonTxt,
      socialButtonIcon,
      inputLogin,
      Or,
      loginButton,
      loginButtonTxt
    } = Styles;


    if(this.state.loading){
      return (
        <View style={[container, centerAll]}>
          <Text>Authenticating user credentials...</Text>
        </View>
      );
    }


    if(this.state.login){
      
      return (
        <View style={[container]}>
          
          <View style={[ centerAll, { flex:2}]} >
            <Image style={{ height: 100, width: 100 }}
              source={ require('../../assets/png/HBD_logo_NEW_SM_tablet.png') }
            />
            <Text style={[ iconColor,  { fontSize: 40, marginTop:20, }]} >#UnlockYourDay</Text>
          </View>

          <View style={[ (Platform.OS==='ios') ? styles.buttomsViewIos : styles.buttomsView ]} >
            
            {/*GOOGLE AND LINKEDIN*/}
            <View style={ { flexDirection: 'row' }}>
              
              <View style={ { alignContent:'stretch' }}>

                <TouchableOpacity style={ googleButton } onPress={_ => this.googleLogin() } >
                  <View style={[container, centerAll, { flexDirection: 'row', }]}>
                    <View style={socialButtonIcon}>
                      <Text><MaterialCommunityIcons color={ '#de5246' } size={25} name={'google'} /></Text>
                    </View>
                    <Text allowFontScaling={false} style={ googleButtonTxt }> Login with Google </Text>
                  </View>
                </TouchableOpacity>

              </View>

            </View>  
            {/*END GOOGLE AND LINKEDIN*/}

            <View style={[ centerAll ]}><Text style={ (Platform.OS==='ios') ? styles.orIos : Or } >OR</Text></View>  

            {/*USER AND PASSWORD*/}
            <View style={[ centerAll ]}>
                <View style={{ flexDirection:'row' }}>
                  <TextInput style={[ inputLogin, {  marginRight:3 }]} placeholder='E-Mail' value={this.state.username} onChangeText={text => this.setState({username: text})} autoCapitalize="none" placeholderTextColor='grey'  />
                  <TextInput style={ inputLogin } placeholder='Password' value={this.state.password} onChangeText={text => this.setState({password: text})} autoCapitalize="none" placeholderTextColor='grey' secureTextEntry={true}  />
                </View>     
            </View>  
            <View>
              <TouchableOpacity style={ (Platform.OS==='ios') ? styles.loginButtonIos : loginButton } onPress={ this._signIn } >
                <View style={[container, centerAll]}>
                  <Text allowFontScaling={false} style={ loginButtonTxt }>LOGIN</Text>
                </View>
              </TouchableOpacity>
            </View>  
            {/*END USER AND PASSWORD*/}

            {/*CONTINUE WHIT GUEST*/}
            <View>
              <TouchableOpacity onPress={_ => this._goAsGuest() } style={[ (Platform.OS==='ios') ? styles.loginButtonIos : loginButton, { marginTop:1 }]} >
                <View style={[container, centerAll]}>
                  <Text allowFontScaling={false} style={[ loginButtonTxt, { fontWeight:'bold' } ]}>OR CONTINUE AS GUEST</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/*END CONTINUE WHIT GUEST*/}
          
          </View>


          <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => BackHandler.exitApp()}
            >
              <Text style={styles.exitText}>Tap here to exit the app</Text>
            </TouchableOpacity>
          </Animated.View>


        </View>
      );

    }else{
      return (
        <View style={[container]}></View>
      );
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
        paddingVertical: 3,
    },
    buttomsView: {
      height: 200,
    },
    buttomsViewIos: {
      flex: 1,
      paddingBottom: 20,
      //height: 250,
    },
    orIos: {
      borderWidth:1,
      borderColor:'#2E5C65',
      color: '#2E5C65',
      paddingLeft: 5,
      paddingRight: 3,
      borderRadius:5,
    },
    loginButtonIos: {
      borderWidth:1,
      borderColor:'#2E5C65',
      height: 40, 
      backgroundColor: '#f5f5f2', 
      marginLeft: 5, 
      marginRight: 5,
      marginTop:7,
      height:35
    }
};
