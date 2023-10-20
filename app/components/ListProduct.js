import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, HStack, Divider} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
const ListProduct = ({onPressItem, data}) => {
  const ITEM_HEIGHT = 70;

  const renderHeader = () => {
    return (
      <Box px={4} py={1} bgColor={'#376FFF'}>
        <HStack space={2} justifyContent={'space-between'}>
          <Box w={'32%'}>
            <Text
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Nama Barang
            </Text>
          </Box>
          <Box w={'20%'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Stok
            </Text>
          </Box>

          <Box w={'30%'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Harga
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  };

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
        <Box px={4} py={1} bgColor={item.curr_stock <= 0 ? '#EAE5E5' : '#FFF'}>
          <Text
            fontWeight={'bold'}
            fontSize={RFPercentage(1.4)}
            color={item.curr_stock <= 0 ? '#C4C4C4' : '#665b4f'}>
            {item.nama_barang}
          </Text>
          <HStack space={2} justifyContent={'space-between'}>
            <Box w={'70%'}>
              <Text
                textAlign={'right'}
                fontSize={RFPercentage(1.4)}
                color={item.curr_stock <= 0 ? '#C4C4C4' : '#665b4f'}>
                {item.curr_stock + ' ' + item.satuan}
              </Text>
            </Box>

            <Box w={'30%'}>
              <Text
                textAlign={'right'}
                fontWeight={'bold'}
                fontSize={RFPercentage(1.4)}
                color={item.curr_stock <= 0 ? '#C4C4C4' : '#665b4f'}>
                {harga}
              </Text>
            </Box>
          </HStack>
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
      ListHeaderComponent={renderHeader}
      StickyHeaderComponent={renderHeader}
    />
  );
};

export default memo(ListProduct);
