import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, VStack, HStack, Divider, Button} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';

const ListJurnal = ({selectValue, onUpdateQty, onDeleteItem, data}) => {
  const ITEM_HEIGHT = 70;

  const renderHeader = () => {
    return (
      <Box width={'100%'} height={50} bgColor={'#376FFF'}>
        <HStack space={2} justifyContent={'space-between'} p={4}>
          <Box w={'5%'} h={30}>
            <Text fontWeight={'bold'} fontSize={15} color={'#FFFFFF'}>
              No.
            </Text>
          </Box>
          <Box w={'10%'}>
            <Text fontWeight={'bold'} fontSize={15} color={'#FFFFFF'}>
              Tanggal
            </Text>
          </Box>
          <Box w={'10%'}>
            <Text fontWeight={'bold'} fontSize={15} color={'#FFFFFF'}>
              Tipe
            </Text>
          </Box>
          <Box w={'30%'}>
            <Text fontWeight={'bold'} fontSize={15} color={'#FFFFFF'}>
              Pos
            </Text>
          </Box>
          <Box w={'20%'}>
            <Text fontWeight={'bold'} fontSize={15} color={'#FFFFFF'}>
              Metode Transaksi
            </Text>
          </Box>

          <Box w={'10%'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={15}
              color={'#FFFFFF'}>
              Nominal
            </Text>
          </Box>
          <Box w={'7%'}></Box>
        </HStack>
      </Box>
    );
  };
  const renderItem = ({item, index}) => {
    const nominal = new Intl.NumberFormat('id-ID').format(item.nominal);
    return (
      <VStack space={2} bgColor={'#FFF'}>
        <Box p={4}>
          <HStack space={2} justifyContent={'space-between'}>
            <Box w={'5%'}>
              <Text fontWeight={'bold'} fontSize={15} color={'#665b4f'}>
                {index + 1}
              </Text>
            </Box>
            <Box w={'10%'}>
              <Text fontWeight={'bold'} fontSize={15} color={'#665b4f'}>
                {moment(item.tanggal).format('DD MMMM YYYY')}
              </Text>
            </Box>
            <Box w={'10%'}>
              <Text fontWeight={'bold'} fontSize={15} color={'#665b4f'}>
                {item.tipe}
              </Text>
            </Box>
            <Box w={'30%'}>
              <VStack>
                <Text fontWeight={'bold'} fontSize={15} color={'#665b4f'}>
                  {item.pos}
                </Text>
                <Text fontSize={15} color={'#665b4f'}>
                  {'Ket:' + item.keterangan}
                </Text>
              </VStack>
            </Box>
            <Box w={'20%'}>
              <Text fontWeight={'bold'} fontSize={15} color={'#665b4f'}>
                {item.metode}
              </Text>
            </Box>

            <Box w={'10%'}>
              <Text
                textAlign={'right'}
                fontWeight={'bold'}
                fontSize={15}
                color={'#665b4f'}>
                {nominal}
              </Text>
            </Box>
            <Box w={'7%'} alignItems={'center'}>
              <TouchableOpacity
                onPress={() => {
                  onDeleteItem(item);
                }}>
                <FontAwesome5 name={'trash'} color={'#AF0E0E'} size={20} />
              </TouchableOpacity>
            </Box>
          </HStack>
        </Box>
        <Divider color={'#665b4f'} />
      </VStack>
    );
  };

  return (
    <FlashList
      ListHeaderComponent={renderHeader}
      data={data}
      estimatedItemSize={100}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListJurnal);
