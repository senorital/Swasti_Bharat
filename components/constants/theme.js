import { Dimensions } from "react-native";
const {width, height} = Dimensions.get("window");


export const COLORS = {
dark_green : '#228B22',    
address_blue :'#F6FCFC',    
user_front_theme_color : "#d6d5ff",   
attention :'#FFEBE2',
attention_text :'#9A491A',    
missingIcon : '#FEF2F4',  
alertText: '#A13532',  
background : "#F9F5FF",
primary : "#391999",
secondary : "#5122df",
tertiary :"#b8b3ff",
white : "#FFFFFF",
black : "#000000",
grey : "#808080",
light_orange : "#FFEACB",
lightgreen : "#E5FFCC",
timeslottext : "#9F6900",
pricetext : "#203E01",
notifyicon : "#F6F7F9",
icon_background : "#d6d5ff",
directions :"#431cbb",
red :'#FCC1A3',
orange :'#FEE5AF',
yellow :"#F7EAB6",
green : '#BAE2D9',
blue :'#ADDEED',
purple : '#A6BCE3',
dark_purple : '#B8ACD7',
dropback : "#F3F4F9"

}


export const SIZES = {
base : 8,
font : 14,
radius : 30,
padding: 8,
padding2 : 12,
padding3 : 16,

largeTitle : 20,
h1 : 16,
h2 : 22,
h3 : 16,
h4 : 15,
h5 : 12,
h6 : 10,

width,
height
}

export const FONTS = {
    largeTitle: {
        fontFamily: 'black',
        fontSize: SIZES.largeTitle,
        lineHeight: 55,
    },
    h2: { fontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: 'Poppins-SemiBold', fontSize: SIZES.h3 },
    h4: { fontFamily: 'Poppins-Medium', fontSize: SIZES.h4 },
    h5: { fontFamily: 'Poppins', fontSize: SIZES.h5, lineHeight: 20 },
    body1: { fontFamily: 'Poppins-Medium', fontSize: SIZES.h3, lineHeight: 20 },
    body2: { fontFamily: 'Poppins-Medium', fontSize: SIZES.h6, lineHeight: 20 },
    body3: { fontFamily: 'regular', fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20 },
}

const appTheme = { COLORS , SIZES , FONTS}

export default appTheme;