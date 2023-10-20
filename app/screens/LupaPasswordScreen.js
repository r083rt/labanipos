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
import Entypo from 'react-native-vector-icons/Entypo';
import {Dimensions, TouchableOpacity} from 'react-native';
import {resetPasswordAPI} from '../apis/auth';
export default function LupaPassword({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const Size = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
  const [noHP, setNoHP] = useState('');
  const [kode, setKode] = useState('');
  const toast = useToast();

  const resetPassword = async () => {
    try {
      setIsLoading(true);
      const response = await resetPasswordAPI({
        no_hp: noHP,
        kode_toko: kode,
      });
      if (response.data.status === 'SUCCESS') {
        setIsLoading(false);
        toast.show({
          title: 'Berhasil',
          description: response.data.description,
        });
        navigation.goBack();
      } else {
        setIsLoading(false);
        toast.show({
          title: 'Terjadi Kesalahan',
          description: response.data.description,
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
        <Box shadow={5} borderRadius={15} bgColor={'#FFFFFF'}>
          <VStack space={4} p={5} alignItems={'center'}>
            <Heading>LUPA PASSWORD</Heading>
            <FormControl isRequired>
              <Stack mx="4" mb={5}>
                <FormControl.Label>No.HP</FormControl.Label>
                <Input
                  onChangeText={text => setNoHP(text)}
                  keyboardType="numeric"
                  placeholder="Masukkan nomor HP Anda"
                />
              </Stack>
              <Stack mx="4" mb={5}>
                <FormControl.Label>Kode Toko</FormControl.Label>
                <Input
                  onChangeText={text => setKode(text)}
                  placeholder="Masukkan nomor Kode Toko"
                />
              </Stack>
              <Stack mx="4" mt={4}>
                <Button.Group justifyContent={'space-between'}>
                  <Button
                    isLoading={isLoading}
                    colorScheme={'info'}
                    onPress={resetPassword}>
                    Reset Password
                  </Button>
                  <Button
                    isLoading={isLoading}
                    colorScheme={'danger'}
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    Batal
                  </Button>
                </Button.Group>
              </Stack>
            </FormControl>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
