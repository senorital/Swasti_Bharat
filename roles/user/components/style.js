import { StyleSheet } from 'react-native';
import { windowHeight,windowWidth } from '../../../utils/Dimensions';

import { COLORS } from '../../../components/constants';

const styles = StyleSheet.create({
  searchBox: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 200, // Limit height
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemSelected: {
    backgroundColor: '#e0e0e0',
  },
  boldText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    // marginBottom: 2,
    color: '#000',
  },
  seemoreText: {
    fontSize: 16,
    color: '#FC9D45',
    // textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
 
  reviewContainer: {
    marginBottom: 20,
    // backgroundColor: 'white',
    padding: 10,   
     
    // borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 2,
    // elevation: 2,
    flex:1
  },
  coursecontent :{
  fontSize:12,
  fontFamily :'Poppins-Medium',
  backgroundColor:'#F3F3F3',
  color:'black',
  padding:4,
  width:100,
  marginBottom:8,
  textAlign:'center',
  borderRadius:4,
  },
  name: {
   
    fontSize: 13,
    fontFamily : 'Poppins-SemiBold',
    marginBottom : 4,
  },
  header: {
    flexDirection: 'row',
    // marginTop:12,
    margin:4
  },
  tabimage : {
    width: 20,
    height: 20,
    marginTop:10,
    paddingTop:10,
     marginBottom:6,
    flexDirection:'row',
    justifyContent:'space-between'
  
  },
    container1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      column: {
        flex: 1,
        padding : 2
      },
      profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 25, // To make it a circle
      },
      followers: {
        textAlign: 'center',
        borderWidth: 2,
        fontSize:13,
        padding:5,
        marginRight:12,
        borderColor: "#000",
        borderRadius:5
      },
     courseRates : { 
     fontFamily: 'Poppins-Medium',
     fontSize: 20,
     padding:10,
     alignItems : 'flex-end',
     color: '#FC9D45'
    },
    buttonContainerFixed: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 16,
      backgroundColor: '#fff',
    },
    buttonContainer: {
      backgroundColor: '#FC9C45',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    video: {
      alignSelf: 'stretch',
      height: 200, // Set the height of the video player as needed
    },
    medtext:{
    color:'#0C0404',
    fontSize:15,
    marginBottom:8,
    textAlign:'left',
    fontFamily:'Poppins-Medium',
    fontWeight:'600'
    },
    titletext :{
    fontFamily:'Poppins',
    fontSize:15,
    marginTop:10
    },

    webview: {
      flex: 1,
    },
    container: {
    marginHorizontal:20,
    backgroundColor : '#fff'
      },
      rowContainer:{
        flexDirection: 'row', // This makes the items align horizontally
        justifyContent: 'space-between',

      },
      descstyle : {
      fontFamily : 'Poppins',
      color : 'grey',
      fontSize : 14
      },
      leftContainer: {
        flex: 1, // This makes the left container take up half of the available space
      alignItems: 'flex-start',
        justifyContent: 'center',
      },
      rightContainer: {
        flex: 1, // This makes the right container take up half of the available space
        // alignItems: 'flex-end',
        // justifyContent: 'center',
      },
      settingstext:{
        fontSize:17,
        marginTop:8,
        marginLeft:0,
        fontFamily:'Poppins-Medium',
        color:'#000'
      },
      columnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      icon: {
        marginRight: 0,
      },
      rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft : 3
      },
      text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#000',
       
        justifyContent : 'space-evenly'
      },
      design :{
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        color: '#000',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius : 4,
        padding:4,
        backgroundColor : '#E0E0E0'
      },
      cardtext :{
        fontSize: 11, color: '#5A5F6C', fontFamily: 'Poppins-Medium', 
        flexShrink: 1,  maxWidth:'90%'
      },
      iconOutline: {
        // textShadowColor: '#000',
        // textShadowOffset: { width: 1, height: 1 },
        // textShadowRadius: 2,
      },
      ratingstext : {
        fontFamily: 'Poppins',
        fontSize: 13,
        textAlign:'center',
        marginLeft : 5,
        color: 'grey',
      },
      navButton: {
        marginTop: 15,
      },
      forgotButton: {
        marginVertical: 35,
      },
      iconimage :{
      height : 16,
      width:18,
      },
      navButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#573353',
        fontFamily: 'Poppins',
      },
      hr :{
        borderColor : '#eee',
        borderWidth : 0.5,
        marginTop:5,
        marginBottom:5
      },
      circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
      
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
      },
      courseImage: {
        width: 130, 
        height: 130, 
        borderRadius:12
      },
      contentBox:{
      backgroundColor:'#fff',  
      },
      content: {
        borderRadius: 20,
        padding:20,
        // margin: 12,
        // marginTop:30
        paddingTop :20
      },
       topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 10,
      },
      icon: {
        width: 30,
        height: 30,
      },
      avatarContainer: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 15,
        overflow: 'hidden',
      },
      greetingText: {
        fontSize: 20,
        color: '#828282',
        fontFamily: 'Poppins-SemiBold',
        // marginBottom: 2,
      },
      additionalText: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
      },
      searchBox: {
        flexDirection: 'row',
        // alignItems: 'center',
        borderRadius: 10,
        width:'100%',
        backgroundColor:COLORS.white
      
      },
      searchInput: {
        fontFamily :'Poppins-Medium',
        paddingVertical: 10,
        fontSize:15,
        width:'100%',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterBox : {
      borderColor : '#E3E5E5',
      borderWidth:1,
      marginLeft:12,
      height:windowHeight/2
    },
    filterIcon: {
      backgroundColor: '#F9F5FF',
      padding: 9,
      justifyContent:'center',
      alignItems:'center',
      marginTop:5,
      marginLeft:12,
      borderColor:COLORS.grey,
      borderWidth:1,
      borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thickBorder: {
    width:60,
    borderRadius:10,
    borderWidth: 1, // Adjust the thickness as needed
    borderColor: '#E3E5E5', // Adjust the color if needed
  },
  categoryBox : {
  borderColor : '#E3E5E5',
  borderWidth:1
  },
  priceCourse : {
    borderColor:'#E3E5E5',
    borderWidth:1,
    padding:2,
    margin:4,
    height:windowHeight/15,
    width:windowWidth/2.4,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center'
  },
      input : {
      flexDirection : 'row',
      borderColor : '#D2D6DB',
      borderWidth:1,
      borderRadius: 10,
      marginTop:5, 
      padding:8,
      // width : windowWidth/1.3
      },
      searchIcon: {
        width: 18,
        height: 18,
        paddingVertical:10,
        marginTop:10,marginHorizontal:12
        // color:COLORS.white
      },
      iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      iconContainer: {
        alignItems: 'center',
      },
      iconText: {
        marginTop: 5,
      },
      ratingContainer: {
        flexDirection: 'row',
        marginTop: 5,
      },
      starRating: {
        textAlign:'center',
        flexDirection: 'row',
      },
      star:{
        fontSize: 12,
        marginRight: 2,
      },
      row : {
      flexDirection:'row',
      // alignItems:'center'
      },
      verticalLine: {
        borderLeftWidth: 1,
      //  marginHorizontal :30,
        borderLeftColor: '#E5E7EB',
        height: '100%', // Make sure the line spans the entire height
        // marginHorizontal: 10, // Adjust the spacing as needed
    },
    radioGroup: {  
      alignItems: 'center', 
      justifyContent: 'space-around', 
      marginTop: 20, 
      borderRadius: 8, 
      backgroundColor: 'white', 
      padding: 16, 
      elevation: 4, 
      shadowColor: '#000', 
      shadowOffset: { 
          width: 0, 
          height: 2, 
      }, 
      shadowOpacity: 0.25, 
      shadowRadius: 3.84, 
  }, 
  radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
}, 
radioLabel: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: '#333', 
}, 
      appButtonContainer: {
        // marginHorizontal: 20,
        marginBottom: 20,
        alignItems:'center'

      },
      languageTab: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        marginRight: 10,
      },
      selectedLanguageTab: {
        // backgroundColor: '#5F33E1',
      },
      selectedLanguageTabText: {
        color: '#ffffff',
      },
      languageTabText: {
        fontSize: 14,
        fontFamily:'Poppins',
        color: '#000',
      },
    appButton: {
      borderRadius: 10,
      paddingVertical: 12,
      width:windowWidth/1.1,
    },
    errorText :{
     color : 'red',
     fontFamily:'Poppins'
    },
    appButtonText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      fontFamily: 'Poppins-Medium',
    },
      mainContainer: {
        marginTop:30,
        flex: 1,
        backgroundColor:'#fff'
      },
      cardContainerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
       marginLeft : 0,
       margin:12,
       marginTop:0,
        backgroundColor: 'white',
        height : windowHeight/3.4,
        width: windowWidth/2,
      },
      imageBackgroundStyle: {
        width: '100%',
        height: 120,
     
      },
      titleView: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        padding:5,
        borderRadius:2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        width:'30' // add width 
      },
      titleStyle: {
        color: '#fff',
        fontSize: 13,
        
      },
      texts: {
        color:'black', fontFamily: 'Poppins-Medium',fontSize:15,textAlign:'left',marginTop:10
      },
      smalltext : {
      fontFamily:'Poppins',
      fontSize : 15, 
      color:'#4F5562',
      marginTop:2
     
      },
      recentSearchesContainer: {
        marginBottom: 20,
      },
      recentSearchesHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      searchResultsContainer: {
        marginBottom: 20,
      },
      searchResultsHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      searchResultItem: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      tabstyle :{
         alignSelf:'center'  ,color : "#fff",borderRadius : 5, width : 280, height:52, marginBottom : 0,
        fontFamily : 'Poppins'
       },
       indicatorStyle: {
        backgroundColor: 'transparent',
        padding: 0,
        borderRadius : 5,
        marginBottom: 0,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
      },
      _baimage: {
        width: windowWidth - 24, // Adjust based on your design
        height: 200,
      },
     
      pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
       bottom:70,
        width: '100%',
      },
      paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#888',
        marginHorizontal: 5,
      },
      paginationDotActive: {
        backgroundColor: '#000',
      },
     batchbtn :{
      backgroundColor:'#ccc',
      borderColor : '#F8F8F8',
      borderWidth:2,
      color:'#000',
      padding:8,
      height:42,
      borderRadius:5,
      flexDirection:'row'   
    
    },
    bactButton: {
      padding:8,
      borderRadius: 8,
      height:40,
      width:100,
      alignItems:'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    bactButtonText: {
      color: '#000',
      fontFamily:'Poppins-Medium',
      textAlign:'center',
     fontSize : 15
    },
    activebactButton: {
      backgroundColor: '#FC9D45',
      borderColor: '#FC9D45',
      borderRadius:12,
      fontSize:12,
      color:'#000'
    },
    activebactButtonText :{
      color: '#fff',
      fontSize:15,
      textAlign:'center',
      fontFamily:'Poppins-Medium'
    },
     tabButton: {
      padding:12,
      borderRadius: 10,
      height:80,
      width:200,
      alignItems:'center',
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: '#ccc',
    },

    timeslotButton: {
      backgroundColor: '#e0e0e0', // Example background color
      paddingVertical: 10,
      marginLeft:0,
      
      paddingHorizontal: 20, // Increase padding for more width
      borderRadius: 10,
      marginHorizontal: 10, // Adjust spacing between buttons
      marginBottom: 10, // Adjust spacing between rows if needed
      minWidth: 80, // Set a minimum width
      alignItems: 'center', // Center the text horizontally
    },
    timeslotButtonText: {
      fontSize: 14,
      color: '#333',
      fontFamily:'Poppins'
    },
    activeTimeslotButton: {
      backgroundColor: '#5F33E1', // Example active background color
    },
    activeButtonText: {
      color: '#fff', // Example active text color
      fontFamily:'Poppins'
    },
    timeslotButtonText:{
     color:'#000',
     fontSize:15,
     fontFamily:'Poppins'
    },
    timeslotInfoText:{
      color:'#000',
      fontSize:12,
      fontFamily:'Poppins' 
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'center',
      backgroundColor: '#5F33E1',
      borderRadius:10,
      marginVertical:10,
      height:windowHeight/15
    },
    quantityButton: {
      borderRadius: 10,marginVertical:10,
      marginHorizontal: 5,
      paddingHorizontal:8,
      fontFamily:'Poppins',fontSize:15
    },
    quantityButtonText: {
      fontSize: 20,fontFamily:'Poppins',
      color: '#fff',
    },
    quantityText: {
      fontSize: 15,
      color:'#fff',
      marginHorizontal: 12,
    },
    activeTabButton: {
      backgroundColor: '#FC9D45',
      borderColor: '#FC9D45',
      borderRadius:10,
      fontSize:12,
      color:'#000'
    },
    tabButtonText: {
      color: '#000',
      fontFamily:'Poppins-Medium',
      textAlign:'center',
     fontSize : 12

    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      width : windowWidth/1.6,
      // backgroundColor:'#5F33E1',
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginTop: 5,
      color:COLORS.black
    },
    datePickerButtonText: {
      fontSize: 14,
     
      // marginRight:12,
      fontFamily:'Poppins'
    },
    dateTimePicker: {
      width: '50%',
    },
    tabDateButtonText: {
      color: '#000',
      fontFamily:'Poppins-Medium',
      textAlign:'center',
     fontSize : 14

    },
    activeTabButtonText: {
      color: '#FFF',
      fontSize:20,
      textAlign:'center',
      fontFamily:'Poppins'
    },
    activeTabdateButtonText: {
      color: '#FFF',
      fontSize:14 ,
      textAlign:'center',
      fontFamily:'Poppins'
    },
    vsmalltext : {
      fontFamily:'Poppins-Light',
      fontSize:13
    }
  ,  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  });
  export { styles }
