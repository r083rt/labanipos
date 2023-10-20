import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, Divider} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
const ListCustomer = ({onPressItem, data}) => {
  const ITEM_HEIGHT = 55;

  const renderItem = ({item, index}) => {
    return (
      <Box
        justifyContent={'center'}
        p={1}
        px={3}
        borderRadius={10}
        bgColor={'#FFF'}
        shadow={1}
        my={1}
        mx={1}
        h={ITEM_HEIGHT}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <Text
            fontSize={RFPercentage(1.3)}
            fontWeight={'bold'}
            numberOfLines={2}>
            {item.nama.toUpperCase()}
          </Text>

          {/* <Divider my={1} opacity={0.3} /> */}
          <Text fontSize={14} numberOfLines={1}>
            {item.alamat}
          </Text>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <FlashList
      estimatedItemSize={100}
      // numColumns={4}
      data={data}
      //   estimatedItemSize={100}
      renderItem={renderItem}
      keyExtractor={item => item.id_pelanggan}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListCustomer);
