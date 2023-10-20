import client from './';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const getProductsAPI = async () => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.get(`${baseUrl}/sync/getStock`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
