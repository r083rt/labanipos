import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, HStack, Divider} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ListProduct = ({onPressItem, data}) => {
  const ITEM_HEIGHT = 70;

  const renderItem = ({item, index}) => {
    const harga = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(item.harga_jual);
    return (
      <TouchableOpacity
        onPress={() => {
          onPressItem(item);
        }}>
        <Box p={2} bgColor={'#FFF'}>
          <Text>{item.nama_barang}</Text>
        </Box>
        <Divider color={'#665b4f'} />
      </TouchableOpacity>
    );
  };

  return (
    <FlashList
      data={data}
      estimatedItemSize={data.length}
      renderItem={renderItem}
      keyExtractor={item => item.id_barang}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListProduct);
