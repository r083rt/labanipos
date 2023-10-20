import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Box} from 'native-base';

const NumberButton = ({number, onPress, textStyle}) => (
  // <Button
  //   style={{width: 40, height: 40}}
  //   title={`${number}`}
  //   onPress={onPress}
  //   color="#333"
  //   textStyle={textStyle}
  // />
  <Button m={3} size={'md'} colorScheme={'info'} onPress={onPress}>
    {number}
  </Button>
);

const NumberButtonGroup = ({onPress}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={styles.container}>
      {numbers.map(number => (
        <NumberButton
          key={number}
          number={number}
          onPress={() => onPress(number)}
          textStyle={styles.buttonText}
        />
      ))}
    </View>
    // <Box w={500} h={50}>
    //   {numbers.map(number => (
    //     <NumberButton
    //       key={number}
    //       number={number}
    //       onPress={() => onPress(number)}
    //       textStyle={styles.buttonText}
    //     />
    //   ))}
    // </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // maxWidth: '100%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NumberButtonGroup;
