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
		color: '#2E5C65',
	},
	backgroundColor: {
		backgroundColor: '#2E5C65',
	},
	backgroundColorLight: {
		backgroundColor: '#f5f5f2',
	},
	borderColor: {
		borderColor:'#2E5C65',
	},
	fontColorGreen: {
		color: '#2E5C65',
	},
	fontSizeResponsive: {
		fontSize: 0.030*width
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
    
})