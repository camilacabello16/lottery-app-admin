import React from 'react';
import {Text} from 'react-native';
import {StyleSheet, View} from 'react-native';

const makeStyle = (size?: number) =>
  StyleSheet.create({
    wrapBall: {
      width: size || 32,
      height: size || 32,
      borderRadius: size ? size / 2 : 16,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#d32e31',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });

interface IBall {
  size?: number;
  number?: number | string;
}

const Ball: React.FC<IBall> = ({size, number}) => {
  const style = makeStyle(size);
  return (
    <View style={style.wrapBall}>
      <Text style={style.text}>{number || 0}</Text>
    </View>
  );
};

export default Ball;
