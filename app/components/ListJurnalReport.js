import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, HStack, Divider} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
const ListJurnalReport = ({onPressItem, data}) => {
  const ITEM_HEIGHT = 30;

  const renderHeader = () => {
    return (
      <Box p={4} bgColor={'#376FFF'}>
        <HStack space={2}>
          <Box w={'20%'} alignItems={'flex-start'}>
            <Text
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={12}
              color={'#FFFFFF'}>
              Tanggal
            </Text>
          </Box>

          <Box w={'55%'} alignItems={'flex-start'}>
            <Text
              textAlign={'left'}
              fontWeight={'bold'}
              fontSize={12}
              color={'#FFFFFF'}>
              Keterangan
            </Text>
          </Box>

          <Box w={'15%'} alignItems={'flex-start'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={12}
              color={'#FFFFFF'}>
              Nominal
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  };

  const renderItem = ({item, index}) => {
    const nominal = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(item.nominal);

    return (
      <Box p={3}>
        <HStack space={2} mb={3}>
          <Box w={'20%'}>
            <Text fontSize={RFValue(9)}>
              {moment(item.trx_tgl).format('DD MMM YYYY')}
            </Text>
          </Box>
          <Box w={'55%'}>
            <Text fontSize={RFValue(9)}>{item.keterangan}</Text>
          </Box>
          <Box w={'15%'}>
            <Text fontSize={RFValue(9)}>{nominal}</Text>
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
      keyExtractor={item => item.trx_no}
      itemHeight={50}
      ListHeaderComponent={renderHeader}
      StickyHeaderComponent={renderHeader}
    />
  );
};

export default memo(ListJurnalReport);
