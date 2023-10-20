import client from './';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const loginAPI = async ({no_hp, password, kode_toko}) => {
  return client.post('/login/doLogin', {
    no_hp,
    password,
    kode_toko,
  });
};

export const changePasswordAPI = async ({
  password_lama,
  password_baru,
  password_baru_confirm,
}) => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.post(
    `${baseUrl}/user/change_password`,
    {
      password_lama,
      password_baru,
      password_baru_confirm,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};
