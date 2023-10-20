import client from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const saveTransactionAPI = async ({
  pelanggan,
  tanggal,
  diskon,
  pilihan_pembayaran,
  jlh_pembayaran,
  metode_pembayaran,
  ongkir,
  pajak,
  trx_detail,
  pembayaran,
}) => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.post(
    `${baseUrl}/transaction/save`,
    {
      pelanggan,
      tanggal,
      diskon,
      pilihan_pembayaran,
      jlh_pembayaran,
      metode_pembayaran,
      ongkir,
      pajak,
      trx_detail,
      pembayaran,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};

export const getTransMethodAPI = async () => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.get(`${baseUrl}/transaction/metode_transaksi`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};

export const getJournalPosAPI = async () => {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('new_api_path');
  return axios.get(`${baseUrl}/transaction/akun_jurnal`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};

export const saveJurnalAPI = async ({tanggal, trx_detail}) => {
  const token = await AsyncStorage.getItem('token');

  return axios.post(
    '/transaction/save_jurnal_kas',
    {
      tanggal,
      trx_detail,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
};
