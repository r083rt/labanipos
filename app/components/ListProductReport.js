import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, HStack, Divider} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
const ListProductReport = ({onPressItem, data}) => {
  const ITEM_HEIGHT = 30;

  const renderHeader = () => {
    return (
      <Box p={4} bgColor={'#376FFF'}>
        <HStack space={2}>
          <Box w={'10%'} alignItems={'flex-start'}>
            <Text
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Tanggal
            </Text>
          </Box>
          <Box w={'18%'} alignItems={'flex-start'}>
            <Text
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Customer
            </Text>
          </Box>
          <Box w={'5%'} alignItems={'flex-start'}>
            <Text
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Ref.
            </Text>
          </Box>
          <Box w={'28%'} alignItems={'flex-start'}>
            <Text
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Nama Barang
            </Text>
          </Box>

          <Box w={'12%'} alignItems={'flex-start'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Harga
            </Text>
          </Box>
          <Box w={'8%'} alignItems={'flex-start'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Qty.
            </Text>
          </Box>
          <Box w={'15%'} alignItems={'flex-start'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Total
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

    const total = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(item.harga_jual * item.jlh_jual);
    return (
      <Box p={3}>
        <HStack space={2} mb={3}>
          <Box w={'10%'}>
            <Text fontSize={15}>
              {moment(item.tanggal).format('DD MMM YYYY')}
            </Text>
          </Box>
          <Box w={'18%'}>
            <Text fontSize={15}>{item.nama_pelanggan}</Text>
          </Box>
          <Box w={'5%'}>
            <Text fontSize={15}>{item.ref}</Text>
          </Box>
          <Box w={'28%'}>
            <Text fontSize={15}>{item.nama_barang}</Text>
          </Box>
          <Box w={'12%'}>
            <Text fontSize={15}>{harga}</Text>
          </Box>
          <Box w={'8%'}>
            <Text fontSize={15}>{item.jlh_jual + ' ' + item.satuan}</Text>
          </Box>
          <Box w={'15%'}>
            <Text fontSize={15}>{total}</Text>
          </Box>
        </HStack>
        <Divider color={'#665b4f'} />
      </Box>
    );
  };

  return (
    <FlashList
      data={data}
      estimatedItemSize={data.length}
      renderItem={renderItem}
      keyExtractor={(item, index) => index}
      itemHeight={50}
      ListHeaderComponent={renderHeader}
      StickyHeaderComponent={renderHeader}
    />
  );
};

export default memo(ListProductReport);
