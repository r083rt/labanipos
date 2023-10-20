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
  Modal,
  Spinner,
  Fab,
  ScrollView,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ListCustomer} from '../components';
import realm from '../models';
import moment from 'moment';
export default function MasterCustomer({navigation, route}) {
  const [customers, setCustomers] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    navigation.addListener('Customer', () => {
      console.log(route.params);
    });
    getCustomer();
  }, []);

  const filterCustomer = search => {
    const customerData = realm
      .objects('Customer')
      .filtered('nama CONTAINS[c]"' + search + '"')
      .sorted('nama');
    setCustomers(customerData);
  };

  const getCustomer = () => {
    const customerData = realm.objects('Customer').sorted('nama');
    setCustomers(customerData);
  };

  const handlSelectCustomer = e => {
    if (route.params.type == 'transaksi') {
      const cart = realm.objects('Cart');
      cart.forEach(item => {
        realm.write(() => {
          realm.delete(item);
        });
      });
      const noTrx = moment().format('YYMMDDHHMMss');
      navigation.replace('Kasir', {
        noTrx: noTrx,
        customer: e,
      });
    } else {
      navigation.replace('NewCustomer', {
        type: 'edit',
        id_pelanggan: e.id_pelanggan,
        nama: e.nama,
        alamat: e.alamat,
        telp: e.telp,
        email: e.email,
      });
    }
  };
  return (
    <Box flex={1} bgColor={'#F4F4F4'} p={10}>
      <Fab
        onPress={() => {
          navigation.replace('NewCustomer', {
            type: 'new',
          });
        }}
        bgColor={'#376FFF'}
        size={'lg'}
        position="absolute"
        icon={<Icon name="plus" size={30} color={'white'} />}
      />

      <Input
        onChangeText={text => {
          filterCustomer(text);
        }}
        InputLeftElement={
          <FontAwesome5 name="search" style={{marginLeft: 10}} />
        }
        placeholder="Cari customer"
        bgColor={'#FFF'}
        borderRadius={10}
        mb={2}
      />
      <ListCustomer onPressItem={handlSelectCustomer} data={customers} />
    </Box>
  );
}
