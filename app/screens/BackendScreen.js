import React, {useState, useEffect} from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Modal,
  Input,
  useToast,
  Center,
  KeyboardAvoidingView,
  Spinner,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import realm from '../models';

export default function Backend({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEDC, setShowModalEDC] = useState(false);
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telp, setTelp] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const toast = useToast();
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      let keys = ['token', 'nama', 'no_hp', 'user_id'];
      await AsyncStorage.multiRemove(keys);
      const cart = realm.objects('Cart');
      const transHeader = realm.objects('TransactionHeader');
      const transDetail = realm.objects('TransactionDetail');
      const jurnalHeader = realm.objects('JournalHeader');
      const jurnalDetail = realm.objects('CashJournal');
      const closing = realm.objects('Closing');

      realm.write(() => {
        realm.delete(cart);
        realm.delete(transHeader);
        realm.delete(transDetail);
        realm.delete(jurnalHeader);
        realm.delete(jurnalDetail);
        realm.delete(closing);
      });
      setTimeout(() => {
        setIsLoading(false);
        navigation.replace('Login');
      }, 2000);
    } catch (e) {
      setIsLoading(false);
      toast.show({
        title: 'Terjadi Kesalahan',
        description: e,
      });
    }
  };

  const getStoreData = () => {
    const store = realm.objects('Store');
    if (store.length > 0) {
      const storedata = store[0];
      setNama(storedata.nama);
      setAlamat(storedata.alamat);
      setTelp(storedata.telp);
      setEmail(storedata.email);
      setFax(storedata.fax);
    }
  };

  useEffect(() => {
    getStoreData();
  }, []);

  const saveStoreData = () => {
    realm.write(() => {
      realm.create('Store', {
        nama: nama,
        alamat: alamat,
        telp: telp,
        email: email,
        fax: fax,
      });
    });

    toast.show({
      title: 'Berhasil',
      description: 'Data toko berhasil disimpan.',
    });
    setShowModal(!showModal);
  };

  return (
    <Box flex={1}>
      <Modal size={'lg'} isOpen={showModal} onClose={() => setShowModal(false)}>
        <KeyboardAvoidingView style={{width: '100%'}} behavior="position">
          <Center>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Input Data Toko</Modal.Header>
              <Modal.Body>
                <HStack space={3} mb={3}>
                  <VStack space={3} w={'48%'}>
                    <Box>
                      <Text fontSize={14} mb={2}>
                        Nama Toko
                      </Text>
                      <Input
                        onChangeText={text => setNama(text)}
                        placeholder="Input nama toko"
                      />
                    </Box>
                  </VStack>
                  <VStack space={3} w={'48%'}>
                    <Box>
                      <Text fontSize={14} mb={2}>
                        Email
                      </Text>
                      <Input
                        onChangeText={text => setEmail(text)}
                        placeholder="Input email toko"
                      />
                    </Box>
                  </VStack>
                </HStack>
                <VStack space={3}>
                  <Box>
                    <Text fontSize={14} mb={2}>
                      Alamat Toko
                    </Text>
                    <Input
                      onChangeText={text => setAlamat(text)}
                      placeholder="Input alamat toko"
                    />
                  </Box>
                </VStack>
                <HStack space={3}>
                  <VStack space={3} w={'48%'}>
                    <Box>
                      <Text fontSize={14} mb={2}>
                        No.Telp
                      </Text>
                      <Input
                        onChangeText={text => setTelp(text)}
                        placeholder="Input no.telp"
                      />
                    </Box>
                  </VStack>
                  <VStack space={3} w={'48%'}>
                    <Box>
                      <Text fontSize={14} mb={2}>
                        No.Fax
                      </Text>
                      <Input
                        onChangeText={text => setFax(text)}
                        placeholder="Input no.fax"
                      />
                    </Box>
                  </VStack>
                </HStack>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button colorScheme={'danger'} onPress={() => {}}>
                    Batal
                  </Button>
                  <Button onPress={saveStoreData}>Simpan</Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Center>
        </KeyboardAvoidingView>
      </Modal>
      <Box p={3} mx={10} my={2} bgColor={'#FFF'} borderRadius={10}>
        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
          <HStack space={6} alignItems={'center'}>
            <Box w={43}>
              <Icon name="house-user" size={40} />
            </Box>
            <Text fontSize={25}>Setting Toko</Text>
          </HStack>
        </TouchableOpacity>
      </Box>
      {/* <Box p={3} mx={10} my={2} bgColor={'#FFF'} borderRadius={10}>
        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
          <HStack space={6} alignItems={'center'}>
            <Box w={43}>
              <Fontisto name="shopping-pos-machine" size={40} />
            </Box>
            <Text fontSize={25}>Mesin EDC</Text>
          </HStack>
        </TouchableOpacity>
      </Box> */}
      <Box p={3} mx={10} my={2} bgColor={'#FFF'} borderRadius={10}>
        {isLoading === false ? (
          <TouchableOpacity onPress={handleLogout}>
            <HStack space={6} alignItems={'center'}>
              <Box w={43}>
                <Icon name="sign-out-alt" size={40} />
              </Box>

              <Text fontSize={25}>Logout</Text>
            </HStack>
          </TouchableOpacity>
        ) : (
          <HStack space={5}>
            <Spinner accessibilityLabel="Loading posts" />
            <Text>Harap Tunggu</Text>
          </HStack>
        )}
      </Box>
    </Box>
  );
}
