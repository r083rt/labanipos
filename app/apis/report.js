import client from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const salesReportAPI = async ({tgl1, tgl2, customer, id_barang}) => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.post(
    `${baseUrl}/laporan/lapPenjualan`,
    {
      tgl1,
      tgl2,
      customer,
      id_barang,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};

export const jurnalReportAPI = async ({tgl1, tgl2, tipe}) => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.post(
    `${baseUrl}/laporan/lapJurnalKas`,
    {
      tgl1,
      tgl2,
      tipe,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};
