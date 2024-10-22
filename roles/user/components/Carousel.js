import * as React from 'react';
import { View,ImageBackground,StyleSheet,FlatList,Text,TouchableWithoutFeedback} from 'react-native';
import {Card} from './Card'
import {Title} from './Form/Title'

const eventslist = [
  {
    src:
      'https://image.freepik.com/free-photo/fried-eggs-drinks-breakfast_23-2147758279.jpg',
    title: 'Breakfast',
  },
  {
    src:
      'https://image.freepik.com/free-photo/indian-masala-egg-omelet_136595-191.jpg',
    title: 'Brunch',
  },
  {
    src:
      'https://image.freepik.com/free-photo/north-indian-thali-tipical-meal-served-stainless-steel-plate-blue-table_107467-1331.jpg',
    title: 'Lunch',
  },
  {
    src:
      'https://image.freepik.com/free-photo/club-sandwich-with-ham-lettuce-tomato-cheese-fries-wooden-board_140725-196.jpg',
    title: 'Snacks',
  },
  {
    src:
      'https://image.freepik.com/free-photo/national-uzbek-pilaf-with-meat-cast-iron-skillet-wooden-table_127425-8.jpg',
    title: 'Dinner',
  },
];

export default class ShareCourse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: '',
    };
  }

  keyExtractor = (item, index) => index.toString();
  renderCarousel = ({item}) => (
    <View>
    <Card style={styles.cardContainerStyle}>
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            data: item.title,
          });
          this.props.onCarouselPress;
        }}>
        <ImageBackground
          source={{uri: item.src}}
          style={styles.imageBackgroundStyle}>
          <View style={styles.titleView}>
            <Title style={styles.titleStyle}>{item.title}</Title>
          </View>
        </ImageBackground>

      </TouchableWithoutFeedback>

    </Card>
    <Text style={styles.text}>{item.title}</Text>
    <View style={{flexDirection : 'row'}}>
    <Text style={styles.text}>$180</Text>
    <Text style={[{textDecorationLine: 'line-through', textDecorationStyle: 'solid'},styles.striketext]}> $150 </Text>
    </View>
    </View>
  );

  render() {
    return (
     <View style={styles.mainContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={this.keyExtractor}
          data={eventslist}
          renderItem={this.renderCarousel}
        />
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
  },
  cardContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    margin: 5,
    width: 220,
  },
  imageBackgroundStyle: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
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
  text: {
    color:'black',marginTop:5, fontFamily: 'Poppins',fontSize:17,textAlign:'left'
  },
  striketext: {
    color:'grey',marginTop:5, fontFamily: 'Poppins-Light',fontSize:18,textAlign:'left',marginLeft:10
  }
 
};
