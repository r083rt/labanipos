import client from './';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const getAllCustomerAPI = async () => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');

  return axios.get(`${baseUrl}/customer/getData/`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};

export const addCustomerAPI = async ({nama, alamat, telp, email}) => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.post(
    `${baseUrl}/customer/insert`,
    {
      nama,
      alamat,
      telp,
      email,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};

export const updateCustomerAPI = async ({
  nama,
  alamat,
  telp,
  email,
  id_customer,
}) => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.post(
    `${baseUrl}/customer/update`,
    {
      nama,
      alamat,
      telp,
      email,
      id_customer,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};
