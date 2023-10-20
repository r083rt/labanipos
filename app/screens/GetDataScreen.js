import React, {useState, useEffect} from 'react';

import {
  Box,
  Text,
  Center,
  HStack,
  VStack,
  Spinner,
  useToast,
} from 'native-base';
import {getAllCustomerAPI} from '../apis/customer';
import {getProductsAPI} from '../apis/product';
import {getJournalPosAPI, getTransMethodAPI} from '../apis/transaction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import realm from '../models';
export default function GetData({navigation, route}) {
  const toast = useToast();
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState('0%');
  useEffect(() => {
    getCustomer();
    // getProduct();
    // getJournalPos();
    // getTransMethod();
    // navigation.replace('Dashboard');
    if (isDone === true) {
      navigation.replace('Dashboard');
    }
  }, []);

  const getCustomer = async () => {
    try {
      setProgress('25%');
      const response = await getAllCustomerAPI();
      if (response.data.status === 'SUCCESS') {
        console.log(response.data);
        const customers = response.data.data;
        customers.forEach(customer => {
          if (customer.nama != null) {
            realm.write(() => {
              realm.create(
                'Customer',
                {
                  id_pelanggan: customer.id_pelanggan,
                  nama: customer.nama,
                  alamat: customer.alamat ? customer.alamat : '',
                  telp: customer.telp ? customer.telp : '',
                  email: customer.email ? customer.email : '',
                  tipe: customer.tipe ? customer.tipe : '',
                  fax: customer.fax ? customer.fax : '',
                },
                true,
              );
            });
            // getProduct();
            // navigation.replace('Dashboard');
            // navigation.replace('Dashboard');
          }
        });
        getProduct();
      }
    } catch (error) {
      toast.show({
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
      let keys = ['token', 'nama', 'no_hp', 'user_id'];
      await AsyncStorage.multiRemove(keys);
      navigation.replace('Login');
    }
  };
  const getProduct = async () => {
    try {
      setProgress('50%');
      const response = await getProductsAPI();
      if (response.data.status === 'SUCCESS') {
        //   console.log(response.data.data);
        const products = response.data.data;
        products.forEach(product => {
          realm.write(() => {
            realm.create(
              'Product',
              {
                id_barang: product.id_barang,
                barcode: product.barcode ? product.barcode : '',
                kategori_barang: product.kategori_barang
                  ? product.kategori_barang
                  : '',
                nama: product.nama ? product.nama : '',
                nama_barang: product.nama_barang ? product.nama_barang : '',
                nama_kategori: product.nama_kategori
                  ? product.nama_kategori
                  : '',
                satuan: product.satuan ? product.satuan : '',
                rak: product.rak ? product.rak : '',
                pabrik: product.pabrik ? product.pabrik : '',
                minimal_stock: product.minimal_stock
                  ? parseInt(product.minimal_stock)
                  : 0,
                curr_stock: product.curr_stock
                  ? parseInt(product.curr_stock)
                  : 0,
                harga_beli: product.harga_beli
                  ? parseInt(product.harga_beli)
                  : 0,
                harga_jual: product.harga_jual
                  ? parseInt(product.harga_jual)
                  : 0,
                point: product.point ? parseInt(product.point) : 0,
                jlh_per_kemasan: product.jlh_per_kemasan
                  ? parseInt(product.jlh_per_kemasan)
                  : 0,
                deskripsi: product.deskripsi ? product.deskripsi : '',
              },
              true,
            );
          });
          // console.log(customer);
          //
        });
        // setIsDone(true);
        // navigation.replace('Dashboard');
        getTransMethod();
      }
    } catch (error) {
      toast.show({
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
      let keys = ['token', 'nama', 'no_hp', 'user_id'];
      await AsyncStorage.multiRemove(keys);
      navigation.replace('Login');
    }
  };
  const getTransMethod = async () => {
    try {
      setProgress('75%');
      const response = await getTransMethodAPI();
      if (response.data.status === 'SUCCESS') {
        //   console.log(response.data.data);
        const products = response.data.data;
        products.forEach(item => {
          realm.write(() => {
            realm.create(
              'TransMethod',
              {
                akun_id: item.akun_id,
                akun_group: item.akun_group,
                nama: item.nama,
              },
              true,
            );
          });
        });
        getJournalPos();
      }
    } catch (error) {
      toast.show({
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
      let keys = ['token', 'nama', 'no_hp', 'user_id'];
      await AsyncStorage.multiRemove(keys);
      navigation.replace('Login');
    }
  };

  const getJournalPos = async () => {
    try {
      setProgress('100%');
      const response = await getJournalPosAPI();
      if (response.data.status === 'SUCCESS') {
        //   console.log(response.data.data);
        const products = response.data.data;
        products.forEach(item => {
          realm.write(() => {
            realm.create(
              'JournalPos',
              {
                akun_id: item.akun_id,
                tipe: item.tipe,
                nama: item.nama,
              },
              true,
            );
          });
        });
        navigation.replace('Dashboard');
      }
    } catch (error) {
      toast.show({
        title: 'Terjadi Kesalahan',
        description: error.message,
      });
      let keys = ['token', 'nama', 'no_hp', 'user_id'];
      await AsyncStorage.multiRemove(keys);
      navigation.replace('Login');
    }
  };

  return (
    <Box flex={1} bgColor={'#376FFF'}>
      <Center flex={1}>
        <Spinner color={'#FFF'} mb={10} />
        <Text color={'#FFF'}>Mengambil Data - Harap Tunggu</Text>
        <Text color={'#FFF'}>{progress}</Text>
      </Center>
    </Box>
  );
}
