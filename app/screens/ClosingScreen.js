import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  KeyboardAvoidingView,
  Heading,
  Divider,
  Input,
  TextField,
  ScrollView,
  useToast,
} from 'native-base';
import {Alert} from 'react-native';
import moment from 'moment';
import 'moment/locale/id';
import realm from '../models';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Closing({navigation, route}) {
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [saldoKas, setSaldoKas] = useState(0);
  const [saldoBank, setSaldoBank] = useState(0);
  const [masukKas, setMasukKas] = useState(0);
  const [masukBank, setMasukBank] = useState(0);
  const [keluarKas, setKeluarKas] = useState(0);
  const [keluarBank, setKeluarBank] = useState(0);
  const toast = useToast();
  const [income, setIncome] = useState({
    cash: 0,
    bank: 0,
  });
  const [name, setName] = useState('');
  useEffect(() => {
    getName();
    getData();
  }, []);

  const getData = () => {
    const trxCash = realm
      .objects('TransactionHeader')
      .filtered("metode_pembayaran='cash'");
    const trxTrf = realm
      .objects('TransactionHeader')
      .filtered("metode_pembayaran='transfer'");
    const totalCash = trxCash.reduce((acc, trxCash) => {
      const {jlh_pembayaran, pajak, ongkir, diskon} = trxCash;
      return acc + jlh_pembayaran + pajak + ongkir - diskon;
    }, 0);

    const totalBank = trxTrf.reduce((acc, trxTrf) => {
      const {jlh_pembayaran, pajak, ongkir, diskon} = trxTrf;
      return acc + jlh_pembayaran + pajak + ongkir - diskon;
    }, 0);
    setIncome({
      cash: totalCash,
      bank: totalBank,
    });
  };

  const getName = async () => {
    const n = await AsyncStorage.getItem('name');
    setName(n || '');
  };

  const handleClosing = () => {
    Alert.alert(
      'Konfirmasi',
      'Pastikan nilai sudah diinput dengan benar. Lanjutkan proses tutup buku ?',
      [
        {
          text: 'Tidak',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YA',
          onPress: async () => {
            realm.write(() => {
              realm.create('Closing', {
                tanggal: moment().format('YYYY-MM-DD'),
                masuk_kas: parseInt(masukKas),
                masuk_bank: parseInt(masukBank),
                keluar_kas: parseInt(keluarKas),
                keluar_bank: parseInt(keluarBank),
                saldo_kas: parseInt(masukKas) - parseInt(keluarKas),
                saldo_bank: parseInt(masukBank) - parseInt(keluarBank),
              });
            });
            let keys = ['token', 'nama', 'no_hp', 'user_id'];
            await AsyncStorage.multiRemove(keys);
            toast.show({
              title: 'Berhasil',
              description: 'Proses tutup buku berhasil. Silahkan login ulang.',
            });
            navigation.replace('Login');
          },
        },
      ],
    );
  };
  return (
    <Box flex={1} bgColor={'#F4F4F4'} p={5}>
      <HStack space={20} mb={5}>
        <VStack space={2}>
          <Text>Tanggal</Text>
          <Text fontSize={25} fontWeight={'bold'}>
            {moment().format('DD MMMM YYYY')}
          </Text>
        </VStack>

        <VStack space={2}>
          <Text>Total Penerimaan Kas</Text>
          <Text fontSize={25} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(masukKas).toString()}
          </Text>
        </VStack>
        <VStack space={2}>
          <Text>Total Penerimaan Bank</Text>
          <Text fontSize={25} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(masukBank).toString()}
          </Text>
        </VStack>
        <VStack space={2}>
          <Text>Total Pengeluaran Kas</Text>
          <Text fontSize={25} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(keluarKas).toString()}
          </Text>
        </VStack>
        <VStack space={2}>
          <Text>Total Pengeluaran Bank</Text>
          <Text fontSize={25} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(keluarBank).toString()}
          </Text>
        </VStack>
      </HStack>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack
          m={3}
          space={3}
          p={10}
          bgColor={'#FFF'}
          borderRadius={10}
          mb={5}>
          <Heading>PENERIMAAN</Heading>
          <Divider />
          <HStack justifyContent={'space-between'}>
            <VStack space={1} w={'30%'}>
              <Text fontSize={19} fontWeight={'bold'}>
                Kas
              </Text>
              <Input
                onChangeText={val => setMasukKas(val)}
                keyboardType="numeric"
                placeholder="Input jumlah penerimaan kas"
              />
            </VStack>
            <VStack space={1} w={'30%'}>
              <Text fontSize={19} fontWeight={'bold'}>
                Bank
              </Text>
              <Input
                onChangeText={val => setMasukBank(val)}
                keyboardType="numeric"
                placeholder="Input jumlah penerimaan bank"
              />
            </VStack>
            <VStack space={1} w={'30%'}>
              <Text fontSize={19} fontWeight={'bold'}>
                Total
              </Text>
              <Text fontSize={25} fontWeight={'bold'}>
                {new Intl.NumberFormat('id-ID')
                  .format(parseInt(masukKas) + parseInt(masukBank))
                  .toString()}
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <VStack
          m={3}
          space={3}
          p={10}
          bgColor={'#FFF'}
          borderRadius={10}
          mb={5}>
          <Heading>PENGELUARAN</Heading>
          <Divider />
          <HStack justifyContent={'space-between'}>
            <VStack space={1} w={'30%'}>
              <Text fontSize={19} fontWeight={'bold'}>
                Kas
              </Text>
              <Input
                onChangeText={val => setKeluarKas(val)}
                keyboardType="numeric"
                placeholder="Input jumlah pengeluaran kas"
              />
            </VStack>
            <VStack space={1} w={'30%'}>
              <Text fontSize={19} fontWeight={'bold'}>
                Bank
              </Text>
              <Input
                onChangeText={val => setKeluarBank(val)}
                keyboardType="numeric"
                placeholder="Input jumlah pengeluaran bank"
              />
            </VStack>
            <VStack space={1} w={'30%'}>
              <Text fontSize={19} fontWeight={'bold'}>
                Total
              </Text>
              <Text fontSize={25} fontWeight={'bold'}>
                {new Intl.NumberFormat('id-ID')
                  .format(parseInt(keluarKas) + parseInt(keluarBank))
                  .toString()}
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <Button m={3} colorScheme={'success'} onPress={handleClosing}>
          TUTUP BUKU
        </Button>
      </ScrollView>
    </Box>
  );
}
