import { StyleSheet, Platform, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    centerAll: {
        justifyContent: 'center',
        alignItems: 'center',
    },
	iconColor: {
		color: '#1eb6ff',
	},
	iconColorWhite:{
		color: '#fff',
	},
	backgroundColor: {
		backgroundColor: '#1eb6ff',
	},
	backgroundColorLight: {
		backgroundColor: '#f5f5f2',
	},
	borderWidth: {
		borderWidth:1,
	},
	borderColor: {
		borderColor:'#1eb6ff',
	},
	fontColorGreen: {
		color: '#000000',
	},
	fontSizeResponsive: {
		fontSize: 0.030*width,
	},
	bgColorBronze: {
		backgroundColor: '#CB7740',
	},
	bgColorSilver: {
		backgroundColor: '#C0C0C0',
	},
	bgColorGold: {
		backgroundColor: '#EDB402',
	},


/*********************/
/**** CSS SIDEBAR ****/
	sidebarTopHeigthHeaderLogo: {
		height:  Platform.OS === 'ios' ? 100 : 80,
	},
	sidebarHeaderLogo:{
		alignContent:'center', 
		alignItems:'center', 
		padding:5, 
		borderBottomWidth:1,
		top: Platform.OS === 'ios' ? 25 : 5,
	},
	sidebarClose: {
		position:'absolute',
		top: Platform.OS === 'ios' ? 25 : 5,
		right: Platform.OS === 'ios' ? 10 : 5,
	},
	sidebarNavBarItemHeader:{
		paddingLeft: 5,
		paddingTop: 8,
		paddingBottom: 8,
	},
	sidebarNavBarItemCont: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	sidebarNavBarImg: {
		paddingLeft: 5,
		width: 35, 
		flexDirection: 'row',
		alignItems: 'center',
	},
	sidebarNavBarItemTxt: {
		paddingLeft: 5,
		fontSize: 16,
	},
	sidebarIconSize: {
		fontSize: 35,
	},
	sidebarFooterCont: {
		alignItems: 'center', 
		flexDirection: 'row', 
		width:'100%', 
		textAlign: 'center',
	},
	sidebarFooterIcons: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center', 
		flexDirection: 'row', 
		width:'100%'
	},
/**** END CSS SIDEBAR ****/
/************************/


/*********************/
/**** CSS MAPS ****/

	mapsSearchbuttons: {
		height: 40, 
		backgroundColor: '#f5f5f2', 
		marginLeft: 5, 
		marginRight: 5
	},
	mapsSearchbuttonsTxt: {
		fontSize: 0.033*width,
		padding: 2,
	},

/**** END CSS SEARCH ****/
/************************/

/*********************/
/**** CSS SEARCH ****/

	searchCont: {
		justifyContent: 'center',
		flex: 1,
		padding: 16,
	},
	searchTxtInput: {
		fontSize: 14,
		height: 40,
		borderWidth: 1,
		paddingLeft: 10,
		backgroundColor: '#FFFFFF',
	},
	searchTxtStyle: {
		padding: 10,
		fontSize: 18,
	},
	searchBtnCurrentLocation: {
		height: 50, 
		borderWidth:1, 
		justifyContent: 'center', 
		alignItems: 'center',
	},


/**** END CSS SEARCH ****/
/************************/


	linkedinButton: {
		height:35, 
		backgroundColor: '#1d89e4', 
		marginLeft: 5, 
		marginRight: 5, 
		marginTop:1, 
		borderWidth:1, 
		borderRadius:3, 
		borderColor:'#888',
	},
	linkedinButtonTxt: {
		fontSize: 0.033*width,
		padding: 2,
		color:'#fff', 
		fontWeight:'bold',
	},

	googleButton: {
		height:35, 
		backgroundColor: '#fff', 
		marginLeft: 5, 
		marginRight: 5, 
		marginTop:1, 
		borderWidth:1, 
		borderRadius:3, 
		borderColor:'#444',
	},
	googleButtonTxt: {
		fontSize: 0.033*width,
		padding: 2,
		color: '#444', 
		fontWeight:'bold',
	},

	socialButtonIcon: {
		paddingLeft: 5,
		width: 35, 
		flexDirection: 'row',
		alignItems: 'center',
	},

	inputLogin:{
		borderWidth:1,
		borderColor:'#1eb6ff',
		height: 40,
		width: '49%',
	},

	Or:{
		borderWidth:1,
		borderColor:'#1eb6ff',
		color: '#1eb6ff',
		paddingLeft: 5,
		paddingRight: 3,
		borderRadius:20
	}, 

	loginButton:{
		height:40, 
		backgroundColor: '#f5f5f2', 
		marginLeft: 5, 
		marginRight: 5, 
		marginTop:1, 
		borderWidth:1, 
		borderColor:'#1eb6ff',
	},

	loginButtonTxt:{
		fontSize: 0.033*width,
		padding: 2,
		color: '#1eb6ff',
	},


	/*DASHBOARD*/

	tabBar: {
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 60,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  tabBarItem: {
  	height: 60,
  	width: 80, 
    borderLeftWidth: 1, 
    //borderRightWidth: 1, 
    paddingLeft: 5, 
    paddingRight:5 
  },

  tabBarItemSelected: {
  	height: 60,
  	width: 80, 
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor:'#1eb6ff',
    backgroundColor: '#1eb6ff',
    //borderRightWidth: 1, 
    paddingLeft: 5, 
    paddingRight:5 
  },

  tapContent: {
  	padding:10, 
  	justifyContent: 'flex-start', 
  	alignItems: 'flex-start',
  },
  tapTitle: {
  	marginBottom: 20,
  	fontWeight:'bold',
  	fontSize: 0.060*width
  },

  tapLineText: {
  	flexDirection:'row', 
  	flexWrap:'wrap', 
  	marginBottom: 10,
  	alignItems: 'center',
  },

  tapTextPill:{
  	fontWeight:'bold', 
  	borderWidth:1, 
  	borderRadius:10, 
  	padding:5, 
  	textAlign:'center', 
  	color:'#fff'
  },

  profileInput: {
    fontSize: 16,
    height: 40,
    borderColor: 'black',
    marginBottom: 25,
	},

    
})