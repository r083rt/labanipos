import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, HStack, VStack, Input, Divider, Button} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native-gesture-handler';

const InputQty = ({onPressItem, onInputQty}) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <VStack space={3}>
      <HStack space={3} justifyContent={'space-between'}>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(1);
          }}>
          1
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(2);
          }}>
          2
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(3);
          }}>
          3
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(4);
          }}>
          4
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(5);
          }}>
          5
        </Button>
      </HStack>
      <HStack space={3} justifyContent={'space-between'}>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(6);
          }}>
          6
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(7);
          }}>
          7
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(8);
          }}>
          8
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(9);
          }}>
          9
        </Button>
        <Button
          w={78}
          h={78}
          borderRadius={10}
          _text={{fontSize: 40, fontWeight: 'bold'}}
          colorScheme={'darkBlue'}
          onPress={() => {
            onPressItem(0);
          }}>
          0
        </Button>
      </HStack>

      <Input
        borderColor={'#376FFF'}
        placeholder={'Input jumlah lainnya'}
        placeholderTextColor={'#376FFF'}
        _text={{fontSize: 20}}
        keyboardType="numeric"
        borderRadius={10}
        onChangeText={val => onInputQty(val)}
      />
    </VStack>
  );
};

export default memo(InputQty);
