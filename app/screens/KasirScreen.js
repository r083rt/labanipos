import React, {useState, useEffect, useMemo} from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Center,
  Button,
  Input,
  useToast,
  useDisclose,
  Spinner,
  Skeleton,
  KeyboardAvoidingView,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {
  Dimensions,
  Modal,
  View,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import realm from '../models';
import {
  ListProduct,
  ListCart,
  InputQty,
  NumberButtonGroup,
} from '../components';
import {getProductsAPI} from '../apis/product';
import {saveTransactionAPI} from '../apis/transaction';
import moment from 'moment';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
export default function Kasir({navigation, route}) {
  let arrItemPPN = [];
  const [selectedID, setSelectedID] = useState('');
  const {isOpen, onOpen, onClose} = useDisclose();
  const [arrayItems, setArrayItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [cartTotal, setCartTotal] = useState(0);
  const [trxTotal, setTrxTotal] = useState(0);
  const [trxDiskon, setTrxDiskon] = useState(0);
  const [trxTax, setTrxTax] = useState(0);
  const [trxOngkir, setTrxOngkir] = useState(0);
  const [itemPPN, setItemPPN] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(
    route.params.customer,
  );
  var totalPPN = 0;
  const toast = useToast();
  const Size = Dimensions.get('screen');
  const [total, setTotal] = useState(0);
  const [showModalSummary, setShowModalSummary] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalTrf, setShowModalTrf] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCart, setDataCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    id_barang: '',
    nama_barang: '',
    harga_jual: 0,
    harga_beli: 0,
    satuan: '',
  });
  const noTrx = route.params.noTrx;
  const [inputQty, setInputQty] = useState(0);
  useEffect(() => {
    // getStock();
    getProducts();
  }, []);

  const searchProduct = keyword => {
    const filtered = realm
      .objects('Product')
      .filtered('nama CONTAINS[c]"' + keyword + '" and curr_stock > 0')
      .sorted('nama');
    setDataProduct(filtered);
  };

  const handleSelectItem = e => {
    setSelectedItem({
      id_barang: e.id,
      nama_barang: e.nama_barang,
      harga_jual: e.harga_jual,
      harga_beli: e.harga_beli,
      satuan: e.satuan,
    });

    setShowModal(!showModal);
  };

  const handleUpdateQty = e => {
    var jumlahItem = parseInt(e);

    if (inputQty != 0) {
      jumlahItem = parseInt(inputQty);
    }
    var itemIndex = arrayItems.findIndex(x => x.id == selectedItem.id_barang);
    var item = arrayItems[itemIndex];
    item.jumlah = jumlahItem;
    item.subtotal = parseInt(jumlahItem) * parseInt(item.harga_jual);
    arrayItems[itemIndex];
    setArrayItems(prevArray => [...prevArray]);
    const total = arrayItems.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
    setShowModal(!showModal);
    console.log(arrayItems);
    // setSelectedID(e.id_barang);
    // setShowModal(!showModal);
  };
  const handleSelectCheckbox = e => {
    var itemIndex = arrayItems.findIndex(x => x.id == e.id);
    var item = arrayItems[itemIndex];

    if (item.ppn === 0) {
      item.ppn = item.subtotal * 0.1;
    } else {
      item.ppn = 0;
    }

    arrayItems[itemIndex];
    setArrayItems(prevArray => [...prevArray]);
    const total = arrayItems.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
  };
  useEffect(() => {
    // Calculate the total whenever arrayItems changes
    const total = arrayItems.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
    setTrxTotal(total);
  }, [arrayItems]);

  const handleInputItem = e => {
    const newItem = {
      id_transaksi: noTrx,
      id: noTrx + '-' + e.id_barang,
      item: e.id_barang,
      nama_barang: e.nama_barang,
      jumlah: parseInt(1),
      satuan: e.satuan,
      harga_beli: parseInt(e.harga_jual),
      harga_jual: parseInt(e.harga_jual),
      subtotal: parseInt(1) * parseInt(e.harga_jual),
      ppn: 0,
    };
    setArrayItems(prevArray => {
      // Add the new item to the array
      const updatedArray = [...prevArray, newItem];

      // Calculate the total based on the updated array
      const total = updatedArray.reduce(
        (accumulator, current) => accumulator + current.subtotal,
        0,
      );
      console.log('total : ', total);
      // Update the trxTotal state with the calculated total
      setTrxTotal(total);

      // Return the updated array to be stored in the state
      return updatedArray;
    });

    // const total = arrayItems.reduce(
    //   (accumulator, current) => accumulator + current.subtotal,
    //   0,
    // );

    // console.log('total : ', total);
    // setTrxTotal(total);
    // setShowModal(false);
  };

  const handleDeleteItem = e => {
    // console.log(e);
    var itemIndex = arrayItems.findIndex(x => x.id == e.id);
    var item = arrayItems[itemIndex];
    console.log(item);
    if (itemIndex !== -1) {
      arrayItems.splice(itemIndex, 1);
    }
    setArrayItems(prevArray => [...prevArray]);
    const total = arrayItems.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
    // const item = realm.objectForPrimaryKey('Cart', e.id);
    // realm.write(() => {
    //   realm.delete(item);
    // });
    // const total = dataCart.reduce(
    //   (accumulator, current) => accumulator + current.subtotal,
    //   0,
    // );
    // setTrxTotal(total);
  };

  const addToCart = qty => {
    var inpQty = parseInt(inputQty) == 0 ? qty : parseInt(inputQty);
    const newItem = {
      id_transaksi: noTrx,
      id: noTrx + '-' + selectedItem.id_barang,
      item: selectedItem.id_barang,
      nama_barang: selectedItem.nama_barang,
      jumlah: parseInt(inpQty),
      satuan: selectedItem.satuan,
      harga_beli: parseInt(selectedItem.harga_jual),
      harga_jual: parseInt(selectedItem.harga_jual),
      subtotal: parseInt(inpQty) * parseInt(selectedItem.harga_jual),
      ppn: 0,
    };
    setArrayItems(prevArray => [...prevArray, newItem]);

    const total = arrayItems.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );

    console.log(total);
    setTrxTotal(total);
    setShowModal(false);
  };

  const handleCheckout = () => {
    arrayItems.forEach(item => {
      realm.write(() => {
        realm.create(
          'Cart',
          {
            id_transaksi: noTrx,
            id: item.id,
            item: item.item,
            nama_barang: item.nama_barang,
            jumlah: item.jumlah,
            satuan: item.satuan,
            harga_beli: item.harga_jual,
            harga_jual: item.harga_jual,
            subtotal: item.subtotal,
            ppn: item.ppn,
          },
          true,
        );
      });
    });
    navigation.navigate('Checkout', {
      customer: route.params.customer,
      noTrx: route.params.noTrx,
    });
  };

  const handleInput = qty => {
    var inpQty = parseInt(inputQty) == 0 ? qty : parseInt(inputQty);
    realm.write(() => {
      realm.create('Cart', {
        id_transaksi: noTrx,
        id: noTrx + '-' + selectedItem.id_barang,
        item: selectedItem.id_barang,
        nama_barang: selectedItem.nama_barang,
        jumlah: parseInt(inpQty),
        satuan: selectedItem.satuan,
        harga_beli: parseInt(selectedItem.harga_jual),
        harga_jual: parseInt(selectedItem.harga_jual),
        subtotal: parseInt(inpQty) * parseInt(selectedItem.harga_jual),
      });
    });
    const total = dataCart.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
    setTrxTotal(total);
    setShowModal(false);
  };

  const getProducts = () => {
    const product = realm
      .objects('Product')
      .filtered('curr_stock > 0')
      .sorted('nama');
    setDataProduct(product);
  };

  const getStock = async () => {
    try {
      setIsLoading(true);
      const response = await getProductsAPI();
      console.log(response.data);
      if (response.data.status === 'SUCCESS') {
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
        });
        const listProduct = realm
          .objects('Product')
          .filtered('curr_stock > 0')
          .sorted('nama');
        setDataProduct(listProduct);
        setIsLoading(false);
      } else {
        setIsLoading(false);

        toast.show({
          render: () => {
            return (
              <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                {response.data.description}
              </Box>
            );
          },
        });
        if (response.data.description === 'Login tidak valid.') {
          let keys = ['token', 'nama', 'no_hp', 'user_id'];
          await AsyncStorage.multiRemove(keys);
          navigation.replace('Login');
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.show({
        title: 'Gagal',
        description: error,
      });
    }
  };

  const handlePay = async () => {
    const detail = dataCart.map(item => {
      return {
        item: item.item,
        jumlah: parseInt(item.jumlah),
        satuan: item.satuan,
        harga_beli: parseInt(item.harga_jual),
        harga_jual: parseInt(item.harga_jual),
        subtotal: parseInt(item.subtotal),
      };
    });

    try {
      setIsLoading(true);
      const response = await saveTransactionAPI({
        pelanggan: '0',
        tanggal: moment().format('YYYY-MM-DD'),
        diskon: trxDiskon,
        pilihan_pembayaran: selectedPayment,
        jlh_pembayaran: total.toString(),
        metode_pembayaran: 'cash',
        ongkir: trxOngkir,
        pajak: trxTax,
        trx_detail: detail,
      });

      if (response.status === 200 && response.data.status === 'SUCCESS') {
        getStock();
        setIsLoading(false);
        toast.show({
          title: 'Sukses',
          description: 'Order berhasil disimpan.',
        });
        navigation.replace('Dashboard');
      }
    } catch (error) {
      setIsLoading(false);
      toast.show({
        title: 'Gagal',
        description: 'Order berhasil disimpan.',
      });
    }
  };

  const handleSaveAsDraft = e => {
    const tglTransaksi = moment().format('YYYY-MM-DD HH:mm:ss');
    const detail = dataCart.map(item => {
      return {
        id: item.id,
        id_transaksi: item.id_transaksi,
        item: item.item,
        jumlah: item.jumlah,
        satuan: item.satuan,
        harga_beli: item.harga_beli,
        harga_jual: item.harga_jual,
        subtotal: item.subtotal,
        ppn: item.ppn,
      };
    });

    realm.write(() => {
      realm.create('TransactionHeader', {
        id_transaksi: noTrx,
        pelanggan: realm.objectForPrimaryKey(
          'Customer',
          route.params.customer.id_pelanggan,
        ),
        tanggal: tglTransaksi,
        diskon: parseInt(trxDiskon),
        pajak: parseInt(trxTax),
        ongkir: parseInt(trxOngkir),
        jlh_pembayaran: trxTotal,
        detail: detail,
        terkirim: 0,
        draft: 1,
        status: 'draft',
      });
    });
    toast.show({
      title: 'Sukses',
      description: 'Order disimpan ke dalam draft transaksi.',
    });
    navigation.goBack();
  };
  // let cartItems = [];
  return (
    <Box flex={1} bgColor={'#F4F4F4'}>
      <Modal
        animationType="none"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
          // setModalVisible(!modalVisible);
        }}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalView}>
            {/* <InputQty
              onPressItem={e => {
                setInputQty(0);

                handleUpdateQty(parseInt(e));
              }}
              onInputQty={e => {
                setInputQty(parseInt(e));
              }}
            /> */}

            <Input
              borderColor={'#376FFF'}
              placeholder={'Input jumlah lainnya'}
              placeholderTextColor={'#376FFF'}
              _text={{fontSize: 20}}
              keyboardType="numeric"
              borderRadius={10}
              onChangeText={val => setInputQty(parseInt(val))}
            />
            <Button.Group justifyContent={'space-between'} mt={5}>
              <Button
                w={RFPercentage(5)}
                colorScheme={'info'}
                onPress={handleUpdateQty}>
                Input
              </Button>
              <Button
                w={RFPercentage(5)}
                colorScheme={'danger'}
                onPress={() => {
                  setInputQty(0);
                  setShowModal(!showModal);
                }}>
                Batal
              </Button>
            </Button.Group>
          </View>
        </View>
      </Modal>

      <HStack flex={1} mt={5}>
        <Box w={'40%'} p={2} borderRadius={10}>
          <Input
            size={'xs'}
            height={7}
            bgColor={'#FFF'}
            mb={2}
            onChangeText={text => {
              searchProduct(text);
            }}
            // borderRadius={10}
            InputLeftElement={
              <Box
                borderRadius={10}
                space={3}
                // m={2}
                px={3}
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}>
                <FontAwesome5
                  size={10}
                  name="search"
                  color={'#376FFF'}
                  fontWeight={'bold'}
                />
              </Box>
            }
            placeholder="Cari Barang"
          />
          {isLoading === true ? (
            <Box flex={1}>
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
              <Skeleton h="100" rounded="md" startColor="#E6E6E6" mb={3} />
            </Box>
          ) : (
            <>
              <ListProduct data={dataProduct} onPressItem={handleInputItem} />

              <Button
                size={'xs'}
                onPress={getStock}
                colorScheme={'info'}
                _text={{fontWeight: 'bold'}}
                _loading={isLoading}>
                Sync Stock
              </Button>
            </>
          )}
        </Box>
        <VStack space={3} p={2} flex={1} w={'55%'} bgColor={'#FFF'}>
          <Box w={'100%'} height={30} bgColor={'#376FFF'} py={1} px={3}>
            <Text
              color={'#FFFFFF'}
              fontSize={RFPercentage(1.4)}
              fontWeight={'bold'}>
              {selectedCustomer.nama}
            </Text>
          </Box>

          <ListCart
            selectValue={handleSelectCheckbox}
            data={arrayItems}
            onDeleteItem={handleDeleteItem}
            onUpdateQty={handleSelectItem}
          />
          <Box w={'100%'} p={3} alignItems={'flex-end'}>
            <HStack w={'100%'} justifyContent={'space-between'}>
              <VStack w={'30%'}>
                <Text textAlign={'left'} fontSize={12}>
                  Nomor Transaksi
                </Text>
                <Text
                  w={250}
                  textAlign={'left'}
                  fontSize={RFPercentage(2)}
                  fontWeight={'bold'}>
                  {noTrx}
                </Text>
              </VStack>

              <VStack w={'30%'}>
                <Text textAlign={'right'} fontSize={12}>
                  Total Transaksi
                </Text>
                <Text
                  // w={250}
                  textAlign={'right'}
                  fontSize={RFPercentage(2)}
                  fontWeight={'bold'}>
                  {new Intl.NumberFormat('id-ID').format(trxTotal)}
                </Text>
              </VStack>
              <Box w={'20%'}>
                <Button
                  colorScheme={'warning'}
                  onPress={handleCheckout}
                  // onPress={() => {
                  //   navigation.navigate('Checkout', {
                  //     customer: route.params.customer,
                  //     noTrx: route.params.noTrx,
                  //   });
                  // }}
                >
                  CHECKOUT
                </Button>
              </Box>
            </HStack>
          </Box>

          {/* <HStack mt={0}>
            <VStack w={'50%'} space={3} bgColor={'#FFF'} p={2} h={150}>
              <HStack
                space={4}
                justifyContent={'flex-start'}
                alignItems={'center'}>
                <Box w={81}>
                  <Text fontWeight={'bold'}>Diskon</Text>
                </Box>

                <Input
                  onChangeText={val =>
                    setTrxDiskon(isNaN(val) ? 0 : parseInt(val))
                  }
                  keyboardType="number-pad"
                  placeholder="Masukkan Diskon"
                  w={220}
                />
              </HStack>

              <HStack
                space={4}
                justifyContent={'flex-start'}
                alignItems={'center'}>
                <Box w={81}>
                  <Text fontWeight={'bold'}>Ongkir</Text>
                </Box>
                <Input
                  onChangeText={val =>
                    setTrxOngkir(isNaN(val) ? 0 : parseInt(val))
                  }
                  keyboardType="number-pad"
                  placeholder="Masukkan Ongkir"
                  w={220}
                />
              </HStack>
            </VStack>
            
            <VStack w={'30%'} space={3} bgColor={'#FFF'} p={5} h={150}>
              <HStack space={5}>
                <Button
                  leftIcon={
                    <FontAwesome5 name="save" size={12} color={'#FFF'} />
                  }
                  onPress={calculatePPN}
                  colorScheme={'warning'}>
                  Simpan ke Draft
                </Button>
                <Button
                  onPress={handlePay}
                  leftIcon={
                    <FontAwesome5
                      name="shopping-cart"
                      size={12}
                      color={'#FFF'}
                    />
                  }
                  colorScheme={'success'}>
                  Checkout
                </Button>
              </HStack>
            </VStack>
          </HStack> */}
        </VStack>
      </HStack>
    </Box>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    width: RFPercentage(50),
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
