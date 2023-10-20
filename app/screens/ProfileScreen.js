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
  Avatar,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dimensions, TouchableOpacity} from 'react-native';
// import {FancyAlert} from 'react-native-expo-fancy-alerts';
export default function Profile({navigation}) {
  const Size = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
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
        <Box shadow={5} borderRadius={15} bgColor={'#FFFFFF'}>
          <VStack space={4} p={5} alignItems={'center'}>
            <Avatar size={'2xl'} source={require('../assets/avatar.png')} />
            <Heading size={'md'}>nama kasir</Heading>
            <Button
              leftIcon={
                <Ionicons
                  name="ios-camera-reverse-outline"
                  color={'#FFF'}
                  size={20}
                />
              }>
              Ganti Foto Profile
            </Button>
            <Stack mx="4" mt={4}>
              <Button.Group justifyContent={'space-between'}>
                <Button
                  colorScheme={'info'}
                  onPress={() => {
                    setVisible(!visible);
                  }}>
                  Simpan
                </Button>
                <Button
                  colorScheme={'danger'}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  Batal
                </Button>
              </Button.Group>
            </Stack>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
