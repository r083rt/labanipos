import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, VStack, HStack, Divider, Button} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
const ListCheckout = ({selectValue, onUpdateQty, onDeleteItem, data}) => {
  const ITEM_HEIGHT = 60;

  const renderItem = ({item, index}) => {
    const harga = new Intl.NumberFormat('id-ID').format(item.harga_jual);
    const total = new Intl.NumberFormat('id-ID').format(item.subtotal);
    return (
      <VStack bgColor={'#FFF'}>
        <Text fontWeight={'bold'}>{item.nama_barang}</Text>
        <HStack space={4} justifyContent={'space-between'}>
          <Text>{item.jumlah + 'x'}</Text>
          <Text>{harga}</Text>
          <Text fontWeight={'bold'} color={'#335A36'}>
            {total}
          </Text>
        </HStack>
        <Divider color={'#665b4f'} my={2} />
      </VStack>
    );
  };

  return (
    <FlashList
      //   ListHeaderComponent={renderHeader}
      data={data}
      estimatedItemSize={100}
      renderItem={renderItem}
      keyExtractor={item => item.item}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListCheckout);
