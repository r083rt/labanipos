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
import {addCustomerAPI, updateCustomerAPI} from '../apis/customer';
import realm from '../models';
export default function NewCustomer({navigation, route}) {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telp, setTelp] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params.type === 'edit') {
      getData();
    }
  }, []);

  const getData = () => {
    setNama(route.params.nama);
    setAlamat(route.params.alamat);
    setTelp(route.params.telp);
    setEmail(route.params.email);
  };

  const handleSave = async () => {
    if (nama === '') {
      alert('Anda belum menginput nama pelanggan');
      return;
    }
    if (route.params.type === 'new') {
      try {
        setIsLoading(true);
        const response = await addCustomerAPI({
          nama: nama,
          alamat: alamat,
          telp: telp,
          tipe: '',
          email: email,
        });
        if (response.data.status === 'SUCCESS') {
          toast.show({
            title: 'Berhasil',
            description: response.data.description,
          });
          setIsLoading(false);
          const id = response.data.data[0].id_pelanggan;
          realm.write(() => {
            realm.create('Customer', {
              id_pelanggan: id,
              nama: nama,
              alamat: alamat,
              telp: telp,
              tipe: '',
              fax: fax,
              email: email,
            });
          });
          navigation.replace('Dashboard');
        } else {
          setIsLoading(false);
          toast.show({
            title: 'Terjadi Kesalahan',
            description: response.data.description,
          });
        }
      } catch (error) {
        setIsLoading(false);
        toast.show({title: 'Terjadi Kesalahan', description: error.message});
      }
    } else {
      try {
        setIsLoading(true);

        const response = await updateCustomerAPI({
          nama: nama,
          alamat: alamat,
          telp: telp,
          email: email,
          fax: fax,
          id_customer: route.params.id_pelanggan,
        });
        const pelanggan = realm.objectForPrimaryKey(
          'Customer',
          route.params.id_pelanggan,
        );
        realm.write(() => {
          pelanggan.nama = nama;
          pelanggan.alamat = alamat;
          pelanggan.telp = telp;
          pelanggan.fax = fax;
          pelanggan.email = email;
        });
        toast.show({
          title: 'Berhasil',
          description: 'Data pelanggan berhasil diupdate',
        });
        setIsLoading(false);

        navigation.replace('Dashboard');
      } catch (error) {
        setIsLoading(false);
        toast.show({title: 'Terjadi Kesalahan', description: error.message});
      }
    }
  };

  return (
    <Box flex={1} bgColor={'#F4F4F4'} p={10}>
      <VStack space={3} mb={6}>
        <Text fontWeight={'bold'} fontSize={16}>
          Nama
        </Text>
        <Input
          bgColor={'#FFF'}
          borderRadius={10}
          value={nama}
          onChangeText={text => setNama(text)}
          placeholder={'Input nama pelanggan'}
        />
      </VStack>
      <VStack space={3} mb={6}>
        <Text fontWeight={'bold'} fontSize={16}>
          Alamat
        </Text>
        <Input
          bgColor={'#FFF'}
          borderRadius={10}
          value={alamat}
          onChangeText={text => setAlamat(text)}
          placeholder={'Input alamat pelanggan'}
        />
      </VStack>
      <HStack space={2} mb={6} justifyContent={'space-between'}>
        <VStack space={3} mb={6} w={'32%'}>
          <Text fontWeight={'bold'} fontSize={16}>
            Telp.
          </Text>
          <Input
            bgColor={'#FFF'}
            borderRadius={10}
            value={telp}
            onChangeText={text => setTelp(text)}
            placeholder={'Input telp. pelanggan'}
          />
        </VStack>
        <VStack space={3} mb={6} w={'32%'}>
          <Text fontWeight={'bold'} fontSize={16}>
            Fax
          </Text>
          <Input
            bgColor={'#FFF'}
            borderRadius={10}
            value={fax}
            onChangeText={text => setTelp(text)}
            placeholder={'Input fax pelanggan'}
          />
        </VStack>
        <VStack space={3} mb={6} w={'32%'}>
          <Text fontWeight={'bold'} fontSize={16}>
            Email
          </Text>
          <Input
            bgColor={'#FFF'}
            borderRadius={10}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder={'Input email pelanggan'}
          />
        </VStack>
      </HStack>
      <Button
        isLoading={isLoading}
        onPress={handleSave}
        colorScheme={'success'}
        _text={{fontWeight: 'bold', fontSize: 18}}>
        Simpan
      </Button>
    </Box>
  );
}
