import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, VStack, HStack, Divider, Center} from 'native-base';
import {Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const ListTransaksi = ({onPressItem, onReprintItem, data}) => {
  const ITEM_HEIGHT = 170;

  const renderItem = ({item, index}) => {
    return (
      <Box
        bgColor={'#FFF'}
        borderRadius={15}
        shadow={2}
        padding={5}
        marginX={5}
        marginBottom={1}
        marginTop={3}>
        <HStack justifyContent={'space-between'}>
          <HStack alignItems={'center'}>
            {/* {item.status === 'selesai' ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onReprintItem(item);
                  }}>
                  <Box mr={10} alignItems={'center'}>
                    <FontAwesome5 name="print" size={50} color={'#4A9B54'} />
                    <Text>Re-print</Text>
                  </Box>
                </TouchableOpacity>
                <Divider orientation="vertical" mr={10} />
              </>
            ) : null} */}
            <TouchableOpacity
              onPress={() => {
                onPressItem(item);
              }}>
              <Box>
                <Text>{moment(item.tanggal).format('DD MMMM YYYY HH:mm')}</Text>
                <Text fontSize={20} fontWeight={'bold'}>
                  NO.TRX - {item.id_transaksi}
                </Text>
                <Text fontSize={30} fontWeight={'bold'}>
                  {item.pelanggan.nama.toUpperCase()}
                </Text>
              </Box>
            </TouchableOpacity>
          </HStack>

          <Box justifyContent={'flex-end'}>
            <Text>Total Transaksi</Text>
            <Text fontSize={30} fontWeight={'bold'} color={'green.700'}>
              {new Intl.NumberFormat('id-ID').format(
                item.jlh_pembayaran + item.ongkir + item.pajak - item.diskon,
              )}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  };

  return (
    <FlashList
      data={data}
      estimatedItemSize={50}
      renderItem={renderItem}
      keyExtractor={item => item.id_transaksi}
      itemHeight={ITEM_HEIGHT}
      ListEmptyComponent={() => {
        return (
          <Center height={Dimensions.get('screen').height * 0.6}>
            <Text fontSize={17}>Belum ada transaksi</Text>
          </Center>
        );
      }}
    />
  );
};

export default memo(ListTransaksi);
