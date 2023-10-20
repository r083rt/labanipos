import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, VStack, HStack, Divider, Center} from 'native-base';
import {Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const ListReprint = ({onPressItem, onReprintItem, data}) => {
  const ITEM_HEIGHT = 170;

  const renderHeader = () => {
    return (
      <Box bgColor={'#283CD4'} p={2}>
        <HStack justifyContent={'space-between'}>
          <Text w={'40%'} textAlign={'left'} color={'#FFFFFF'}>
            Nama Barang
          </Text>

          <Text w={'20%'} textAlign={'right'} color={'#FFFFFF'}>
            Harga x Jumlah
          </Text>
          <Text w={'17%'} textAlign={'right'} color={'#FFFFFF'}>
            PPN
          </Text>
          <Text w={'17%'} textAlign={'right'} color={'#FFFFFF'}>
            SubTotal
          </Text>
        </HStack>
      </Box>
    );
  };

  const renderItem = ({item, index}) => {
    const harga = new Intl.NumberFormat('id-ID').format(item.harga_jual);
    const total = new Intl.NumberFormat('id-ID').format(item.subtotal);
    const ppn = new Intl.NumberFormat('id-ID').format(item.ppn);
    return (
      <Box bgColor={'#FFF'} p={2}>
        <HStack justifyContent={'space-between'}>
          <Text w={'40%'} textAlign={'left'}>
            {item.nama_barang}
          </Text>

          <Text w={'20%'} textAlign={'right'}>
            {harga + ' x ' + item.jumlah + ' ' + item.satuan}
          </Text>
          <Text w={'17%'} textAlign={'right'}>
            {ppn}
          </Text>
          <Text w={'17%'} textAlign={'right'}>
            {total}
          </Text>
        </HStack>
      </Box>
    );
  };

  return (
    <FlashList
      ListHeaderComponent={renderHeader}
      data={data}
      estimatedItemSize={50}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListReprint);
