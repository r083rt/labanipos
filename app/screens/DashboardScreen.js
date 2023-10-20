import React, {useState, useEffect} from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Center,
  Button,
  Input,
  FormControl,
  Heading,
  Stack,
  useToast,
  Divider,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Dimensions, TouchableOpacity} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';
import moment from 'moment';
import realm from '../models';
export default function Dashboard({navigation, route}) {
  const [name, setName] = useState('');
  const [store, setStore] = useState(null);
  const Size = Dimensions.get('screen');
  const itemMenu = [
    {
      name: 'PENJUALAN',
      icon: 'cash-register',
      route: 'MasterCustomer',
    },
    {
      name: 'JURNAL KAS',
      icon: 'balance-scale-left',
      route: 'JurnalKas',
    },
    {
      name: 'CUSTOMER',
      icon: 'users',
      route: 'MasterCustomer',
    },
    {
      name: 'TUTUP BUKU',
      icon: 'book',
      route: 'Closing',
    },
    {
      name: 'LAPORAN PENJUALAN',
      icon: 'chart-line',
      route: 'ReportSales',
    },
    {
      name: 'LAPORAN JURNAL KAS',
      icon: 'book-open',
      route: 'ReportJurnal',
    },
  ];
  const itemUtility = [
    // {
    //   name: 'PROFILE',
    //   icon: 'user-tie',
    //   route: 'Profile',
    // },
    {
      name: 'BACK END',
      icon: 'cog',
      route: 'Backend',
    },
    {
      name: 'GANTI PASSWORD',
      icon: 'user-lock',
      route: 'GantiPassword',
    },
    {
      name: 'PRINTER',
      icon: 'print',
      route: 'SettingPrinter',
    },
  ];

  const getStore = () => {
    const s = realm.objects('Store');

    if (s.length > 0) {
      setStore(s[0]);
    }
  };

  const getName = async () => {
    const n = await AsyncStorage.getItem('name');
    setName(n || '');
  };

  return (
    <Box flex={1} bgColor={'#FFFFFF'} m={0} p={5}>
      {/* <HStack justifyContent={'space-between'}>
        {store != null ? (
          <VStack>
            <Heading>{store.nama}</Heading>
            <Heading size={'sm'} mb={10}>
              {store.alamat}
            </Heading>
          </VStack>
        ) : (
          <Heading color={'#BC5151'}>Nama Toko Belum di Set</Heading>
        )}
        <VStack>
          <Heading size={'sm'}>Kasir</Heading>
          <Heading mb={10}>{name.toUpperCase()}</Heading>
        </VStack>
      </HStack>
      <Divider my={1} /> */}
      <SectionGrid
        itemDimension={130}
        sections={[
          {
            title: 'Menu',
            data: itemMenu.slice(0, 7),
            index: 0,
          },
          {
            title: 'Utility',
            data: itemUtility.slice(0, 3),
            index: 1,
          },
        ]}
        renderItem={({item}) => (
          <Box
            p={4}
            w={120}
            h={120}
            shadow={5}
            borderRadius={10}
            bgColor={'#376FFF'}
            alignItems={'center'}>
            <TouchableOpacity
              onPress={() => {
                if (item.name === 'PENJUALAN') {
                  navigation.navigate('Transaksi');
                } else if (item.name === 'CUSTOMER') {
                  navigation.navigate('MasterCustomer', {
                    type: 'master',
                  });
                } else {
                  navigation.navigate(item.route);
                }
              }}>
              <VStack space={4} justifyContent={'center'} alignItems={'center'}>
                <FontAwesome5 name={item.icon} color={'#FFF'} size={30} />
                <Text color={'#FFF'} fontWeight={'bold'} textAlign={'center'}>
                  {item.name}
                </Text>
              </VStack>
            </TouchableOpacity>
          </Box>
        )}
        renderSectionHeader={({section, index}) => (
          <>
            {section.index != 0 ? <Divider my={5} /> : null}
            <Box p={2} borderTopRadius={10}>
              <Heading size={'md'}>{section.title}</Heading>
            </Box>
          </>
        )}
      />
    </Box>
  );
}
