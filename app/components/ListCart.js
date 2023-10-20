import React, {Component, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, Text, VStack, HStack, Divider, Button} from 'native-base';
import numeral from 'numeral';
import {TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
const ListCart = ({selectValue, onUpdateQty, onDeleteItem, data}) => {
  const ITEM_HEIGHT = 60;

  const renderHeader = () => {
    return (
      <Box width={'100%'} height={30} bgColor={'#376FFF'}>
        <HStack space={2} justifyContent={'space-between'} px={4} py={1}>
          <Box w={'5%'} h={30}>
            <Text
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              PPN.
            </Text>
          </Box>
          <Box w={'6%'}>
            <Text
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Kode
            </Text>
          </Box>
          <Box w={'30%'}>
            <Text
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Nama Barang
            </Text>
          </Box>
          <Box w={'8%'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Qty
            </Text>
          </Box>
          <Box w={'10%'}>
            <Text
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Harga
            </Text>
          </Box>

          <Box w={'15%'}>
            <Text
              textAlign={'right'}
              fontWeight={'bold'}
              fontSize={RFPercentage(1.4)}
              color={'#FFFFFF'}>
              Total
            </Text>
          </Box>
          <Box w={'5%'}></Box>
        </HStack>
      </Box>
    );
  };
  const renderItem = ({item, index}) => {
    const harga = new Intl.NumberFormat('id-ID').format(item.harga_jual);
    const total = new Intl.NumberFormat('id-ID').format(item.subtotal);
    return (
      <VStack bgColor={'#FFF'}>
        <Box p={4}>
          <HStack
            space={2}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Box w={'5%'}>
              <CheckBox
                onCheckColor='"#283CD4'
                disabled={false}
                onChange={() => {
                  selectValue(item);
                }}
                value={item.ppn === 0 ? false : true}
                // onValueChange={val => {
                //   selectValue(val);
                // }}
              />
            </Box>
            <Box w={'6%'}>
              <Text
                fontWeight={'bold'}
                fontSize={RFPercentage(1.4)}
                color={'#665b4f'}>
                {item.item}
              </Text>
            </Box>
            <Box w={'30%'}>
              <Text
                fontWeight={'bold'}
                fontSize={RFPercentage(1.4)}
                color={'#665b4f'}>
                {item.nama_barang}
              </Text>
            </Box>
            <Box w={'8%'}>
              <Button
                size={'sm'}
                height={8}
                _text={{fontWeight: 'bold'}}
                onPress={() => onUpdateQty(item)}
                colorScheme={'info'}>
                {item.jumlah}
              </Button>
            </Box>
            <Box w={'10%'}>
              <Text
                fontWeight={'bold'}
                fontSize={RFPercentage(1.4)}
                color={'#665b4f'}>
                {harga}
              </Text>
            </Box>

            <Box w={'15%'}>
              <Text
                textAlign={'right'}
                fontWeight={'bold'}
                fontSize={RFPercentage(1.4)}
                color={'#665b4f'}>
                {total}
              </Text>
            </Box>
            <Box w={'5%'}>
              <TouchableOpacity
                onPress={() => {
                  onDeleteItem(item);
                }}>
                <FontAwesome5
                  name={'trash'}
                  color={'#AF0E0E'}
                  size={RFPercentage(1.4)}
                />
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
      keyExtractor={item => item.item}
      itemHeight={ITEM_HEIGHT}
    />
  );
};

export default memo(ListCart);
