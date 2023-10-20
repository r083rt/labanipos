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
  Image,
} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import {changePasswordAPI} from '../apis/auth';
import {Dimensions, TouchableOpacity} from 'react-native';
// import {FancyAlert} from 'react-native-expo-fancy-alerts';
export default function GantiPassword({navigation}) {
  const Size = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      const response = await changePasswordAPI({
        password_lama: oldPass,
        password_baru: newPass,
        password_baru_confirm: confirmPass,
      });
      if (response.data.status === 'SUCCESS') {
        setIsLoading(false);
        toast.show({
          title: 'Terjadi Kesalahan',
          description: response.data.description + ' Silahkan login ulang',
        });
        navigation.replace('Login');
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
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
    }
  };
  return (
    <Box flex={1} bgColor={'#376FFF'}>
      {/* <FancyAlert
        visible={visible}
        icon={
          <Box
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#1EBF29',
              borderRadius: 60,
              width: '100%',
            }}>
            <Entypo name="check" size={24} color="#FFF" />
          </Box>
        }
        style={{backgroundColor: 'white', width: 200}}>
        <Text style={{marginTop: -16, marginBottom: 10}}>
          Cek Pesan di Whatsapp Anda untuk reset password
        </Text>
        <Button
          mb={5}
          w={100}
          colorScheme={'info'}
          onPress={() => {
            setVisible(!visible);
            navigation.replace('Login');
          }}>
          OK
        </Button>
      </FancyAlert> */}
      <Center flex={1}>
        <HStack position={'absolute'}>
          <Box w={Size.width / 2}>
            <Image
              source={require('../assets/bgGantiPass.png')}
              resizeMode={'center'}
            />
          </Box>
          <Box
            w={Size.width / 2}
            p={10}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box shadow={5} borderRadius={15} bgColor={'#FFFFFF'}>
              <VStack space={4} p={5} alignItems={'center'}>
                <Heading>GANTI PASSWORD</Heading>
                <FormControl isRequired>
                  <Stack mx="4">
                    <FormControl.Label>Password Lama</FormControl.Label>
                    <Input
                      onChangeText={text => setOldPass(text)}
                      placeholder="Masukkan password lama"
                    />
                  </Stack>
                  <Stack mx="4">
                    <FormControl.Label>Password Baru</FormControl.Label>
                    <Input
                      onChangeText={text => setNewPass(text)}
                      placeholder="Masukkan password baru"
                    />
                  </Stack>
                  <Stack mx="4">
                    <FormControl.Label>
                      Ketik Ulang Password Baru
                    </FormControl.Label>
                    <Input
                      onChangeText={text => setConfirmPass(text)}
                      placeholder="Ketik ulang password baru"
                    />
                  </Stack>
                  <Stack mx="4" mt={4}>
                    <Button.Group>
                      <Button
                        isLoading={isLoading}
                        colorScheme={'info'}
                        onPress={handleChangePassword}>
                        Ganti
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
          </Box>
        </HStack>
      </Center>
    </Box>
  );
}
