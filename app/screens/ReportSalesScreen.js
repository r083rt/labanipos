import React, {useState, useEffect} from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Select,
  Center,
  Button,
  IconButton,
  Input,
  FormControl,
  Heading,
  Stack,
  useToast,
  Divider,
  FlatList,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {
  ListCustomerFilter,
  ListProductFilter,
  ListProductReport,
} from '../components';
import {salesReportAPI} from '../apis/report';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import realm from '../models';

export default function ReportSales({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [item, setItem] = useState('');
  const [data, setData] = useState([]);
  const [openD1, setOpenD1] = useState(false);
  const [openD2, setOpenD2] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    id_barang: '',
    nama_barang: '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState({
    id_pelanggan: '',
    nama: '',
  });

  const [queryProduct, setQueryProduct] = useState('');
  const [queryCust, setQueryCust] = useState('');

  const [startP, setStartP] = useState('');
  const [endP, setEndP] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const generateReport = async () => {
    const tgl1 = moment(startP).format('YYYY-MM-DD');
    const tgl2 = moment(endP).format('YYYY-MM-DD');
    const customer = selectedCustomer.id_pelanggan;
    const id_barang = selectedProduct.id_barang;

    try {
      setIsLoading(true);
      const response = await salesReportAPI({
        tgl1: tgl1,
        tgl2: tgl2,
        customer: customer,
        id_barang: id_barang,
      });

      if (response.data.status === 'SUCCESS') {
        setIsLoading(false);
        console.log(response.data.data);
        setData(response.data.data);
      } else {
        setIsLoading(false);
        console.log(response.data);
        toast.show({
          title: 'Terjadi Kesalahan',
          description: response.data.description,
        });
        if (response.data.description === 'Login tidak valid.') {
          let keys = ['token', 'nama', 'no_hp', 'user_id'];
          await AsyncStorage.multiRemove(keys);
          navigation.replace('Login');
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.show({
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
    }
  };

  const searchCustomer = text => {
    const customers = realm
      .objects('Customer')
      .filtered("nama CONTAINS[c] '" + text + "'");
    setQueryCust(text);
    setDataCustomer(customers);
  };

  const searchProduct = text => {
    const products = realm
      .objects('Product')
      .filtered("nama_barang CONTAINS[c] '" + text + "'");

    setQueryProduct(text);
    setDataProduct(products);
  };

  return (
    <Box flex={1} bgColor={'#F4F4F4'}>
      <DatePicker
        modal
        mode="date"
        open={show}
        date={new Date()}
        locale="id"
        onConfirm={date => {
          setStartP(date);
          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={show2}
        date={new Date()}
        locale="id"
        onConfirm={date => {
          setEndP(date);
          setShow2(false);
        }}
        onCancel={() => {
          setShow2(false);
        }}
      />
      <Box m={3} bgColor={'#FFFFFF'} borderRadius={10} p={2}>
        <HStack space={3}>
          <VStack space={2}>
            <Text fontSize={10} fontWeight={'bold'}>
              Barang
            </Text>
            {selectedProduct.id_barang === '' ? (
              <Input
                onChangeText={text => searchProduct(text)}
                size={'xs'}
                h={38}
                w={100}
                mt={1}
                placeholder={'Cari barang'}
              />
            ) : (
              <HStack
                space={3}
                alignItems={'center'}
                mt={1}
                borderRadius={5}
                borderColor={'#dcdcdc'}
                borderWidth={1}>
                <Box w={RFValue(80)}>
                  <Text left={2} fontSize={RFPercentage(1)} fontWeight={'bold'}>
                    {selectedProduct.nama_barang}
                  </Text>
                </Box>
                <Box w={50}>
                  <IconButton
                    onPress={() => {
                      setSelectedProduct({
                        id_barang: '',
                        nama_barang: '',
                      });
                    }}
                    icon={<FontAwesome name={'close'} size={17} />}
                  />
                </Box>
              </HStack>
            )}
          </VStack>
          <VStack space={2}>
            <Text fontSize={10} fontWeight={'bold'}>
              Customer
            </Text>
            {selectedCustomer.id_pelanggan === '' ? (
              <Input
                onChangeText={text => searchCustomer(text)}
                size={'xs'}
                h={38}
                w={100}
                mt={1}
                placeholder={'Cari customer'}
              />
            ) : (
              <HStack
                space={3}
                alignItems={'center'}
                mt={1}
                borderRadius={5}
                borderColor={'#dcdcdc'}
                borderWidth={1}>
                <Box w={RFValue(80)}>
                  <Text left={2} fontSize={RFPercentage(1)} fontWeight={'bold'}>
                    {selectedCustomer.nama}
                  </Text>
                </Box>
                <Box w={50}>
                  <IconButton
                    onPress={() => {
                      setSelectedCustomer({
                        id_pelanggan: '',
                        nama: '',
                      });
                    }}
                    icon={<FontAwesome name={'close'} size={17} />}
                  />
                </Box>
              </HStack>
            )}
          </VStack>
          <VStack space={2}>
            <Text fontSize={10} fontWeight={'bold'}>
              Periode
            </Text>
            <HStack mt={1} alignItems={'center'} space={3}>
              <Input
                onChangeText={() => {
                  setStartP('');
                }}
                onFocus={() => {
                  setShow(true);
                }}
                size={'xs'}
                h={38}
                w={160}
                placeholder="Periode Awal">
                {startP != '' ? moment(startP).format('DD MMMM YYYY') : ''}
              </Input>

              <Input
                onChangeText={() => {
                  setEndP('');
                }}
                onFocus={() => {
                  setShow2(true);
                }}
                size={'xs'}
                h={38}
                w={160}
                placeholder="Periode Akhir">
                {endP != '' ? moment(endP).format('DD MMMM YYYY') : ''}
              </Input>
            </HStack>
          </VStack>
          <VStack space={2}>
            <Text></Text>
            <HStack alignItems={'center'} space={3}>
              <Button
                size={'sm'}
                isLoading={isLoading}
                backgroundColor={'#376FFF'}
                onPress={generateReport}>
                Lihat
              </Button>
            </HStack>
          </VStack>
          <VStack space={2}>
            <Text></Text>
            <HStack alignItems={'center'} space={3}>
              <Button
                size={'sm'}
                isLoading={isLoading}
                colorScheme={'danger'}
                onPress={() => {
                  setData([]);
                  setDataCustomer([]);
                  setDataProduct([]);
                  setStartP('');
                  setEndP('');
                  setSelectedCustomer({
                    id_pelanggan: '',
                    nama: '',
                  });
                  setSelectedProduct({
                    id_barang: '',
                    nama_barang: '',
                  });
                }}>
                Reset
              </Button>
            </HStack>
          </VStack>
        </HStack>
        {queryProduct != '' && dataProduct.length > 0 ? (
          <Box w={500} position={'absolute'} top={100} shadow={6}>
            <ListProductFilter
              data={dataProduct}
              onPressItem={e => {
                setSelectedProduct({
                  id_barang: e.id_barang,
                  nama_barang: e.nama_barang,
                });

                setDataProduct([]);
                setQueryProduct('');
              }}
            />
          </Box>
        ) : null}
        {queryCust != '' && dataCustomer.length > 0 ? (
          <Box w={500} position={'absolute'} left={130} top={100} shadow={6}>
            <ListCustomerFilter
              data={dataCustomer}
              onPressItem={e => {
                setSelectedCustomer({
                  id_pelanggan: e.id_pelanggan,
                  nama: e.nama,
                });

                setDataCustomer([]);
                setQueryCust('');
              }}
            />
          </Box>
        ) : null}
      </Box>
      {data.length > 0 ? (
        <Box m={3} bgColor={'#FFFFFF'} borderRadius={10} p={5} flex={1}>
          <ListProductReport data={data} />
        </Box>
      ) : (
        <Center flex={1}>
          <Text>Tidak ada data</Text>
        </Center>
      )}
    </Box>
  );
}
