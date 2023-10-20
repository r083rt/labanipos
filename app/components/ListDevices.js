import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, Divider} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ListDevices = ({onPressItem, data}) => {
  const ITEM_HEIGHT = 100;

  const renderItem = ({item, index}) => {
    console.log(item);
    return (
      <Box
        p={4}
        m={3}
        bgColor={'#FFFFFF'}
        shadow={3}
        minW={200}
        borderRadius={10}>
        <TouchableOpacity onPress={() => onPressItem(item)}>
          <Text fontWeight={'bold'}>{item.name}</Text>
          <Text>{item.address}</Text>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <FlashList
      // numColumns={4}
      estimatedItemSize={100}
      data={data}
      //   estimatedItemSize={100}
      renderItem={renderItem}
      keyExtractor={item => item.address}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListDevices);
