import React from 'react';
import {Text, Platform} from 'react-native';

const Title = props => (
  <Text style={[styles.titleStyle, props.style]}>{props.children}</Text>
);

const styles = {
  titleStyle: {
    ...Platform.select({
      android: {
        fontFamily: 'Poppins',
      },
      ios: {
        fontFamily: 'Poppins',
      },
    }),
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },
};

export {Title};