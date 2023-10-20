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
} from 'native-base';
import {loginAPI} from '../apis/auth';
import Lottie from 'lottie-react-native';
import {Alert, Dimensions, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LoginScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  // const [noHP, setNoHP] = useState('085834213649');
  // const [pass, setPass] = useState('LBDT2zlo');
  // const [kodeToko, setKodeToko] = useState('001-202');
  const [noHP, setNoHP] = useState('');
  const [pass, setPass] = useState('');
  const [kodeToko, setKodeToko] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        navigation.replace('Dashboard');
      }
    };

    validateToken();
  }, []);

  const Size = Dimensions.get('screen');

  const handleLogin = async () => {
    if (noHP === '' && pass === '' && kodeToko === '') {
      Alert.alert(
        'Perhatian',
        'No HP, Password dan Kode Toko tidak boleh kosong!',
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await loginAPI({
        no_hp: noHP,
        password: pass,
        kode_toko: kodeToko,
      });
      if (response.data.status === 'SUCCESS') {
        setIsLoading(false);
        const data = response.data.data;

        const token = ['token', data.token];
        const name = ['name', data.real_name];
        const no_hp = ['no_hp', data.no_hp];
        const user_id = ['user_id', data.userID];
        const new_api_path = ['new_api_path', data.new_api_path];

        await AsyncStorage.multiSet([
          token,
          name,
          no_hp,
          user_id,
          new_api_path,
        ]);

        navigation.navigate('GetData');
      } else {
        setIsLoading(false);
        toast.show({
          title: 'Terjadi kesalahan',
          description: 'Username atau password salah!.',
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast.show({
        title: 'Terjadi kesalahan',
        description: error.message,
      });
    }
  };

  return (
    <Box flex={1} bgColor={'#376FFF'}>
      <Center flex={1}>
        <HStack space={5}>
          <Box w={'55%'}>
            <Lottie loop autoPlay source={require('../assets/shopping.json')} />
          </Box>
          <Box w={'35%'} shadow={5} borderRadius={15} bgColor={'#FFFFFF'}>
            <VStack space={4} p={5} alignItems={'center'}>
              <Heading>LOGIN</Heading>
              <FormControl isRequired>
                <Stack mx="4">
                  <FormControl.Label>No.HP</FormControl.Label>
                  <Input
                    keyboardType="numeric"
                    placeholder="Masukkan no.hp"
                    onChangeText={text => setNoHP(text)}
                  />
                </Stack>
                <Stack mx="4">
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type="password"
                    placeholder="Masukkan password"
                    onChangeText={text => setPass(text)}
                  />
                </Stack>
                <Stack mx="4">
                  <FormControl.Label>Kode Toko</FormControl.Label>
                  <Input
                    placeholder="Masukkan Kode Toko"
                    onChangeText={text => setKodeToko(text)}
                  />
                </Stack>
                <Stack mx="4" mt={4}>
                  <Button.Group justifyContent={'space-between'}>
                    <Button
                      isLoading={isLoading}
                      isLoadingText="Harap tunggu"
                      colorScheme={'info'}
                      onPress={handleLogin}>
                      Masuk
                    </Button>
                    <Button
                      colorScheme={'danger'}
                      onPress={() => {
                        navigation.push('LupaPassword');
                      }}>
                      Lupa Password
                    </Button>
                  </Button.Group>
                </Stack>
              </FormControl>
            </VStack>
          </Box>
        </HStack>
      </Center>
    </Box>
  );
}
