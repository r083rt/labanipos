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
import {Alert} from 'react-native';
import {ListJurnalReport} from '../components';
import {jurnalReportAPI} from '../apis/report';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import realm from '../models';

export default function ReportJurnal({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [tipe, setTipe] = useState('');
  const [data, setData] = useState([]);

  const [startP, setStartP] = useState('');
  const [endP, setEndP] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const generateReport = async () => {
    if (startP === '') {
      Alert.alert('Perhatian', 'Periode awal belum dipilih');
      return;
    }
    if (endP === '') {
      Alert.alert('Perhatian', 'Periode akhir belum dipilih');
      return;
    }
    if (tipe === '') {
      Alert.alert('Perhatian', 'Tipe transaksi belum dipilih');
      return;
    }
    const tgl1 = moment(startP).format('YYYY-MM-DD');
    const tgl2 = moment(endP).format('YYYY-MM-DD');

    try {
      setIsLoading(true);
      const response = await jurnalReportAPI({
        tgl1: tgl1,
        tgl2: tgl2,
        tipe: tipe,
      });

      console.log(response.data.data);

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
      console.log(error.message);
      setIsLoading(false);
      toast.show({
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
    }
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
      <Box m={3} bgColor={'#FFFFFF'} borderRadius={10} p={5}>
        <HStack space={3}>
          <VStack space={2}>
            <Text>Tipe</Text>
            <Select
              selectedValue={tipe}
              minWidth="200"
              accessibilityLabel="Pilih tipe jurnal"
              placeholder="Pilih tipe jurnal"
              mt={1}
              onValueChange={itemValue => {
                setTipe(itemValue);
              }}>
              <Select.Item label="Penerimaan" value="penerimaan" />
              <Select.Item label="Pengeluaran" value="pengeluaran" />
            </Select>
          </VStack>
          <VStack space={2}>
            <Text>Periode</Text>
            <HStack mt={1} alignItems={'center'} space={3}>
              <Input
                onChangeText={() => {
                  setStartP('');
                }}
                onFocus={() => {
                  setShow(true);
                }}
                w={150}
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
                w={150}
                placeholder="Periode Akhir">
                {endP != '' ? moment(endP).format('DD MMMM YYYY') : ''}
              </Input>
            </HStack>
          </VStack>
          <VStack space={2}>
            <Text></Text>
            <HStack mt={1.5} alignItems={'center'} space={3}>
              <Button
                isLoading={isLoading}
                w={100}
                height={45}
                backgroundColor={'#376FFF'}
                onPress={generateReport}>
                Lihat
              </Button>
            </HStack>
          </VStack>
          <VStack space={2}>
            <Text></Text>
            <HStack mt={1.5} alignItems={'center'} space={3}>
              <Button
                isLoading={isLoading}
                w={100}
                height={45}
                colorScheme={'danger'}
                onPress={() => {
                  setData([]);
                  setTipe('');
                  setStartP('');
                  setEndP('');
                }}>
                Reset
              </Button>
            </HStack>
          </VStack>
        </HStack>
      </Box>
      {data.length > 0 ? (
        <Box m={3} bgColor={'#FFFFFF'} borderRadius={10} p={5} flex={1}>
          <ListJurnalReport data={data} />
        </Box>
      ) : (
        <Center flex={1}>
          <Text>Tidak ada data</Text>
        </Center>
      )}
    </Box>
  );
}
