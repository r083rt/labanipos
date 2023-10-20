import React, {useState, useEffect} from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Center,
  Button,
  Input,
  useToast,
  Modal,
  Spinner,
  Select,
  Divider,
  ScrollView,
  KeyboardAvoidingView,
  TextField,
  Heading,
} from 'native-base';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Modal as Modal2,
} from 'react-native';
import moment from 'moment';
import realm from '../models';
import {ListCart, ListCheckout} from '../components';
import {saveTransactionAPI} from '../apis/transaction';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Checkout({navigation, route}) {
  const [arrayItems, setArrayItems] = useState([]);
  const [dataCart, setDataCart] = useState(null);
  const [showModalSummary, setShowModalSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [showTrf, setShowTrf] = useState(false);
  const [showDebit, setShowDebit] = useState(false);
  const [bankTujuan, setBankTujuan] = useState('');
  const [bankPengirim, setBankPengirim] = useState('');
  const [nomorRek, setNomorRek] = useState('');
  const [namaRek, setNamaRek] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mesinEDC, setMesinEDC] = useState('');
  const [bankEDC, setBankEDC] = useState('');
  const [nomorKartu, setNomorKartu] = useState('');
  const [trxTotal, setTrxTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [trxDiskon, setTrxDiskon] = useState(0);
  const [trxTax, setTrxTax] = useState(0);
  const [trxOngkir, setTrxOngkir] = useState(0);
  const [payment, setPayment] = useState(0);
  const [changePayment, setChangePayment] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [printerAddress, setPrinterAddress] = useState('');
  const tglTransaksi = moment().format('DD MMM YY HH:mm');
  const [metodeData, setMetodeData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [edcData, setEDCData] = useState([]);
  const [selectedMetode, setSelectedMetode] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankName, setBankName] = useState('');
  const [inputQty, setInputQty] = useState(0);
  const [selectedItem, setSelectedItem] = useState({
    id_barang: '',
    nama_barang: '',
    harga_jual: 0,
    harga_beli: 0,
    satuan: '',
  });

  const toast = useToast();
  useEffect(() => {
    getCart();
    getBank();
    connectToPrinter();
  }, []);

  const getBank = () => {
    const b = realm
      .objects('TransMethod')
      .filtered("akun_group='Bank'")
      .sorted('nama');

    const e = realm
      .objects('TransMethod')
      .filtered("akun_group='E-Money_EDC'")
      .sorted('nama');

    setEDCData(e);
    setBankData(b);
  };

  const connectToPrinter = async () => {
    const printer = realm.objects('PrinterSetting');

    if (printer.length > 0) {
      await BluetoothManager.connect(printer[0].address);
    }
  };

  async function printInvoice() {
    const noTrx = route.params.noTrx;
    const storeData = realm.objects('Store');
    const store = storeData[0];

    const header = realm.objectForPrimaryKey('TransactionHeader', noTrx);
    const grandTotal =
      header.jlh_pembayaran + header.ongkir + header.pajak - header.diskon;

    const detail = realm
      .objects('TransactionDetail')
      .filtered("id_transaksi='" + noTrx + "'");

    console.log('detail : ' + detail);

    const kasir = await AsyncStorage.getItem('name');
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );
    if (storeData.length > 0) {
      await BluetoothEscposPrinter.printText(
        store.nama.toUpperCase() + '\n' + store.alamat.toUpperCase() + '\n',
        {
          fonttype: 1,
        },
      );
    }

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printText(
      header.pelanggan.nama.toUpperCase() + '\n',
      {
        fonttype: 1,
        printerAlign: 'left',
      },
    );
    let columnWidths = [14, 10, 17];
    await BluetoothEscposPrinter.printColumn(
      columnWidths,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [noTrx, '  ', tglTransaksi],
      {fonttype: 1},
    );
    await BluetoothEscposPrinter.printText(
      'Kasir : ' + kasir.toUpperCase() + '\n',
      {
        fonttype: 1,
        printerAlign: 'left',
      },
    );
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );

    detail.forEach(async d => {
      let columnWidths = [17, 5, 9, 12];
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          d.nama_barang.toString(),
          d.jumlah.toString(),
          new Intl.NumberFormat('id-ID').format(d.harga_jual).toString(),
          new Intl.NumberFormat('id-ID').format(d.subtotal).toString(),
        ],
        {fonttype: 1},
      );
    });
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    let footerColWidth = [17, 5, 7, 12];
    await BluetoothEscposPrinter.printColumn(
      footerColWidth,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [
        'Subtotal : ',
        '  ',
        '  ',
        new Intl.NumberFormat('id-ID').format(header.jlh_pembayaran).toString(),
      ],
      {fonttype: 1},
    );
    await BluetoothEscposPrinter.printColumn(
      footerColWidth,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [
        'Ongkir : ',
        '  ',
        '  ',
        new Intl.NumberFormat('id-ID').format(header.ongkir).toString(),
      ],
      {fonttype: 1},
    );
    await BluetoothEscposPrinter.printColumn(
      footerColWidth,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [
        'PPn : ',
        '  ',
        '  ',
        new Intl.NumberFormat('id-ID').format(header.pajak).toString(),
      ],
      {fonttype: 1},
    );
    await BluetoothEscposPrinter.printColumn(
      footerColWidth,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [
        'Diskon : ',
        '  ',
        '  ',
        new Intl.NumberFormat('id-ID').format(header.diskon * -1).toString(),
      ],
      {fonttype: 1},
    );

    await BluetoothEscposPrinter.printColumn(
      footerColWidth,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [
        'Grand Total : ',
        '  ',
        '  ',
        new Intl.NumberFormat('id-ID').format(grandTotal).toString(),
      ],
      {fonttype: 1},
    );
    await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});

    navigation.replace('Dashboard');
  }

  const getCart = () => {
    const trxHeader = realm.objectForPrimaryKey(
      'TransactionHeader',
      route.params.noTrx,
    );

    if (trxHeader) {
      setTrxOngkir(trxHeader.ongkir);
      setTrxTax(trxHeader.pajak);
    }

    const c = realm
      .objects('Cart')
      .filtered("id_transaksi='" + route.params.noTrx + "'");

    setDataCart(c);
    const total = c.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
    const ppn = c.reduce(
      (accumulator, current) => accumulator + current.ppn,
      0,
    );
    setTrxTotal(total);
    setTrxTax(ppn);
  };

  const handleSelectCheckbox = e => {
    const rowItem = realm.objectForPrimaryKey('Cart', e.id);
    const totalPPN = rowItem.subtotal * 0.1;

    const ppnitem = rowItem.ppn === 0 ? totalPPN : 0;
    realm.write(() => {
      rowItem.ppn = ppnitem;
    });

    getCart();
    calculatePPN();
  };

  const handleDeleteItem = e => {
    const item = realm.objectForPrimaryKey('Cart', e.id);
    realm.write(() => {
      realm.delete(item);
    });
    const total = dataCart.reduce(
      (accumulator, current) => accumulator + current.subtotal,
      0,
    );
    setTrxTotal(total);

    getCart();
  };

  const handleUpdateQty = e => {
    var jumlahItem = parseInt(inputQty);
    const rowItem = realm.objectForPrimaryKey('Cart', selectedItem.id_barang);
    realm.write(() => {
      rowItem.ppn = 0;
      rowItem.jumlah = jumlahItem;
      rowItem.subtotal = jumlahItem * rowItem.harga_jual;
    });
    getCart();
    setShowModal(!showModal);
    // return;

    // var itemIndex = arrayItems.findIndex(x => x.id == selectedItem.id_barang);
    // var item = arrayItems[itemIndex];
    // item.jumlah = jumlahItem;
    // item.subtotal = parseInt(jumlahItem) * parseInt(item.harga_jual);
    // arrayItems[itemIndex];
    // setArrayItems(prevArray => [...prevArray]);
    // const total = arrayItems.reduce(
    //   (accumulator, current) => accumulator + current.subtotal,
    //   0,
    // );
    // setShowModal(!showModal);
    // console.log(arrayItems);
    // setSelectedID(e.id_barang);
    // setShowModal(!showModal);
  };

  const calculatePPN = () => {
    totalPPN = dataCart.reduce(
      (accumulator, current) => accumulator + current.ppn,
      0,
    );

    setTrxTax(totalPPN);
  };

  const handleSaveAsDraft = e => {
    const tglTransaksi = moment().format('YYYY-MM-DD HH:mm:ss');
    const detail = dataCart.map(item => {
      return {
        id: item.id,
        id_transaksi: item.id_transaksi,
        nama_barang: item.nama_barang,
        item: item.item,
        jumlah: item.jumlah,
        satuan: item.satuan,
        harga_beli: item.harga_beli,
        harga_jual: item.harga_jual,
        subtotal: item.subtotal,
        ppn: item.ppn,
      };
    });

    const trxHeader = realm.objectForPrimaryKey(
      'TransactionHeader',
      route.params.noTrx,
    );

    if (trxHeader) {
      realm.write(() => {
        trxHeader.detail = detail;
        trxHeader.pajak = parseInt(trxTax);
        trxHeader.diskon = parseInt(trxDiskon);
        trxHeader.ongkir = parseInt(trxOngkir);
        trxHeader.jlh_pembayaran = parseInt(trxTotal);
      });
    } else {
      realm.write(() => {
        realm.create(
          'TransactionHeader',
          {
            id_transaksi: route.params.noTrx,
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
          },
          true,
        );
      });
    }

    toast.show({
      title: 'Sukses',
      description: 'Order disimpan ke dalam draft transaksi.',
    });
    navigation.replace('Transaksi');
  };

  const handlePay = async () => {
    var id = '';
    var name = '';
    var noRef = '';
    var atasnama = '';

    if (payment === '') {
      alert('Anda belum mengisi jumlah uang');
      return;
    }

    if (selectedMetode === '') {
      alert('Anda belum memilih metode transaksi');
      return;
    }

    if (paymentMethod === 'transfer') {
      const bankinputString = selectedMetode;
      const bankpipeIndex = bankinputString.indexOf('|');
      const bankval = bankinputString.substring(0, bankpipeIndex);
      const banklabel = bankinputString.substring(bankpipeIndex + 1);
      id = bankval;
      name = banklabel;
      noRef = nomorRek;
      atasnama = namaRek;
    } else if (paymentMethod === 'debit') {
      console.log(selectedMetode);
      const metodeinputString = selectedMetode;
      const metodepipeIndex = metodeinputString.indexOf('|');
      const metodeval = metodeinputString.substring(0, metodepipeIndex);
      const metodelabel = metodeinputString.substring(metodepipeIndex + 1);
      name = bankName;
      id = metodeval;
      noRef = nomorKartu;
      atasnama = '';
    } else if (paymentMethod === 'cash') {
      id = selectedMetode;
    }

    console.log({
      metode: id,
      asal_bank: name,
      noref: noRef,
      atas_nama: atasnama,
    });

    const tglTransaksi = moment().format('YYYY-MM-DD HH:mm:ss');
    const detail = dataCart.map(item => {
      return {
        id: item.id,
        id_transaksi: route.params.noTrx,
        nama_barang: item.nama_barang,
        item: item.item,
        jumlah: parseInt(item.jumlah),
        satuan: item.satuan,
        harga_beli: parseInt(item.harga_jual),
        harga_jual: parseInt(item.harga_jual),
        subtotal: parseInt(item.subtotal),
      };
    });
    const trxHeader = realm.objectForPrimaryKey(
      'TransactionHeader',
      route.params.noTrx,
    );

    if (trxHeader) {
      realm.write(() => {
        trxHeader.detail = detail;
        trxHeader.pajak = parseInt(trxTax);
        trxHeader.diskon = parseInt(trxDiskon);
        trxHeader.ongkir = parseInt(trxOngkir);
        trxHeader.jlh_pembayaran = parseInt(trxTotal);
      });
    } else {
      realm.write(() => {
        realm.create(
          'TransactionHeader',
          {
            id_transaksi: route.params.noTrx,
            pelanggan: realm.objectForPrimaryKey(
              'Customer',
              route.params.customer.id_pelanggan,
            ),
            nama_pemilik: namaRek,
            nomor_rekening: nomorRek,
            tanggal: tglTransaksi,
            diskon: parseInt(trxDiskon),
            pajak: parseInt(trxTax),
            ongkir: parseInt(trxOngkir),
            jlh_pembayaran: trxTotal,
            metode_pembayaran: id,
            bank_pengirim: name,
            detail: detail,
            terkirim: 0,
            draft: 1,
            status: 'draft',
          },
          true,
        );
      });
    }

    try {
      setIsLoading(true);
      // const bankinputString = selectedMetode;
      // const bankpipeIndex = bankinputString.indexOf('|');
      // const bankval = bankinputString.substring(0, bankpipeIndex);
      // const banklabel = bankinputString.substring(bankpipeIndex + 1);
      // const id = bankval;
      // const name = banklabel;
      // console.log(id);
      // console.log(name);
      const pembayaran = {
        metode: id,
        asal_bank: name,
        noref: noRef,
        atas_nama: atasnama,
      };
      const connDevices = await BluetoothManager.getConnectedDeviceAddress();

      if (connDevices != '') {
        printInvoice();
      }
      const response = await saveTransactionAPI({
        pelanggan: route.params.customer.id_pelanggan,
        tanggal: moment().format('YYYY-MM-DD'),
        diskon: trxDiskon,
        pilihan_pembayaran: paymentMethod,
        jlh_pembayaran: trxTotal.toString(),
        metode_pembayaran: id,
        ongkir: trxOngkir,
        pajak: trxTax,
        trx_detail: detail,
        pembayaran: pembayaran,
      });

      if (response.status === 200 && response.data.status === 'SUCCESS') {
        const trx = realm.objectForPrimaryKey(
          'TransactionHeader',
          route.params.noTrx,
        );

        if (trx) {
          realm.write(() => {
            trx.metode_pembayaran = id;
            trx.pilihan_pembayaran = paymentMethod;
            trx.bank_pengirim = name;
            trx.bayar = changePayment;
            trx.kembali = changePayment;
            trx.terkirim = 1;
            trx.draft = 0;
            trx.status = 'selesai';
          });
        } else {
          const tglTransaksi = moment().format('YYYY-MM-DD HH:mm:ss');
          realm.write(() => {
            realm.create(
              'TransactionHeader',
              {
                id_transaksi: route.params.noTrx,
                pelanggan: realm.objectForPrimaryKey(
                  'Customer',
                  route.params.customer.id_pelanggan,
                ),
                tanggal: tglTransaksi,
                diskon: parseInt(trxDiskon),
                pajak: parseInt(trxTax),
                ongkir: parseInt(trxOngkir),
                jlh_pembayaran: trxTotal,
                metode_pembayaran: id,
                bank_pengirim: name,
                detail: detail,
                terkirim: 1,
                draft: 0,
                status: 'selesai',
              },
              true,
            );
          });
        }

        setIsLoading(false);
        toast.show({
          title: 'Sukses',
          description: 'Order berhasil disimpan.',
        });
        navigation.replace('Transaksi');
      } else {
        setIsLoading(false);
        console.log(response.data);
        toast.show({
          title: 'Terjadi Kesalahan',
          description: response.data.description,
        });
        if (response.data.description === 'Login tidak valid.') {
          let keys = ['token', 'nama', 'no_hp', 'user_id'];
          await AsyncStorage.multiRemove(keys);
          navigation.replace('Login');
        }
      }
    } catch (error) {
      setShowCash(false);
      setShowTrf(false);
      setIsLoading(false);
      toast.show({
        title: 'Gagal',
        description: 'Order gagal disimpan. (' + error + ')',
      });
      navigation.replace('Transaksi');
    }
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

  return (
    <Box flex={1} bgColor={'#FFFFFF'} p={5}>
      <Modal2
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
              <Button w={'40%'} colorScheme={'info'} onPress={handleUpdateQty}>
                Input
              </Button>
              <Button
                w={'40%'}
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
      </Modal2>
      <Modal isOpen={showCash} onClose={() => setShowCash(false)} size={'md'}>
        <KeyboardAvoidingView style={{width: '100%'}} behavior="position">
          <Center>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Pembayaran Cash</Modal.Header>
              <Modal.Body>
                <VStack space={3}>
                  <Text>Uang Diterima</Text>
                  <TextField
                    value={payment}
                    fontSize={30}
                    fontWeight={'bold'}
                    keyboardType="numeric"
                    onChangeText={val => {
                      const sanitizedValue = val.replace(/,/g, '');
                      const numericValue = isNaN(sanitizedValue)
                        ? 0
                        : parseFloat(sanitizedValue);
                      const formattedValue = new Intl.NumberFormat(
                        'id-ID',
                      ).format(numericValue);

                      const moneychange =
                        numericValue -
                        (trxTotal + trxTax + trxOngkir - trxDiskon);

                      setPayment(formattedValue);
                      setChangePayment(moneychange);
                    }}></TextField>
                </VStack>
                <VStack space={3}>
                  <Text>Metode Transaksi</Text>
                  <Select
                    selectedValue={selectedMetode}
                    minWidth="350"
                    accessibilityLabel="Pilih Metode Transaksi"
                    placeholder="Pilih Metode Transaksi"
                    mt={1}
                    onValueChange={itemValue => {
                      setSelectedMetode(itemValue);
                    }}>
                    {metodeData.map(val => {
                      return (
                        <Select.Item label={val.nama} value={val.akun_id} />
                      );
                    })}
                  </Select>
                </VStack>
              </Modal.Body>
              <Modal.Footer>
                <Box w={'100%'}>
                  <Button
                    isLoading={isLoading}
                    colorScheme={'info'}
                    onPress={handlePay}>
                    Simpan dan Cetak Invoice
                  </Button>
                </Box>
              </Modal.Footer>
            </Modal.Content>
          </Center>
        </KeyboardAvoidingView>
      </Modal>
      <Modal isOpen={showTrf} onClose={() => setShowTrf(false)} size={'lg'}>
        <KeyboardAvoidingView style={{width: '100%'}} behavior="position">
          <Center>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Pembayaran Transfer</Modal.Header>
              <Modal.Body>
                <VStack space={3}>
                  <HStack space={3} w={'100%'}>
                    <VStack space={2} w={'99%'}>
                      <Text>Nama Bank</Text>
                      <Select
                        selectedValue={selectedMetode}
                        minWidth="350"
                        accessibilityLabel="Pilih Bank"
                        placeholder="Pilih Bank"
                        mt={1}
                        onValueChange={itemValue => {
                          setSelectedMetode(itemValue);
                        }}>
                        {bankData.map(val => {
                          return (
                            <Select.Item
                              label={val.nama}
                              value={val.akun_id + '|' + val.nama}
                            />
                          );
                        })}
                      </Select>
                    </VStack>
                  </HStack>
                  <HStack space={3} w={'100%'}>
                    <VStack space={2} w={'48%'}>
                      <Text>Nama Pemilik Rekening</Text>
                      <Input
                        placeholder="Nama pemilik rekening"
                        onChangeText={text => setNamaRek(text)}
                      />
                    </VStack>
                    <VStack space={2} w={'48%'}>
                      <Text>Nomor Rekening Pengirim</Text>
                      <Input
                        placeholder="Nomor rekening"
                        onChangeText={text => setNomorRek(text)}
                      />
                    </VStack>
                  </HStack>
                </VStack>
              </Modal.Body>
              <Modal.Footer>
                <Box w={'100%'}>
                  <Button
                    isLoading={isLoading}
                    colorScheme={'info'}
                    onPress={handlePay}>
                    Simpan dan Cetak Invoice
                  </Button>
                </Box>
              </Modal.Footer>
            </Modal.Content>
          </Center>
        </KeyboardAvoidingView>
      </Modal>
      <Modal isOpen={showDebit} onClose={() => setShowDebit(false)} size={'lg'}>
        <KeyboardAvoidingView style={{width: '100%'}} behavior="position">
          <Center>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Pembayaran Debit</Modal.Header>
              <Modal.Body>
                <VStack space={3}>
                  <VStack space={2} w={'100%'}>
                    <Text>Mesin EDC</Text>
                    <Select
                      selectedValue={selectedMetode}
                      accessibilityLabel="Pilih Mesin EDC"
                      placeholder="Pilih Mesin EDC"
                      mt={1}
                      onValueChange={itemValue => {
                        setSelectedMetode(itemValue);
                      }}>
                      {edcData.map(val => {
                        return (
                          <Select.Item
                            label={val.nama}
                            value={val.akun_id + '|' + val.nama}
                          />
                        );
                      })}
                    </Select>
                  </VStack>
                  <VStack space={2} w={'100%'}>
                    <Text>Nama Bank</Text>
                    <Select
                      selectedValue={bankName}
                      accessibilityLabel="Pilih Bank"
                      placeholder="Pilih Bank"
                      mt={1}
                      onValueChange={itemValue => {
                        setBankName(itemValue);
                      }}>
                      {bankData.map(val => {
                        return (
                          <Select.Item label={val.nama} value={val.nama} />
                        );
                      })}
                    </Select>
                  </VStack>
                  <VStack space={2} w={'100%'}>
                    <Text>Nomor Kartu</Text>
                    <Input
                      placeholder="Nomor Kartu"
                      onChangeText={text => setNomorKartu(text)}
                    />
                  </VStack>
                </VStack>
              </Modal.Body>
              <Modal.Footer>
                <Box w={'100%'}>
                  <Button
                    isLoading={isLoading}
                    colorScheme={'info'}
                    onPress={handlePay}>
                    Simpan dan Cetak Invoice
                  </Button>
                </Box>
              </Modal.Footer>
            </Modal.Content>
          </Center>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        size={'xl'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Pilih Metode Pembayaran</Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              <HStack space={10} justifyContent={'center'}>
                <Box
                  h={150}
                  w={150}
                  p={5}
                  bgColor={'#FFF'}
                  shadow={4}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPayment(false);
                      setPaymentMethod('cash');
                      const method = realm
                        .objects('TransMethod')
                        .filtered("akun_group='Kas'")
                        .sorted('nama');
                      setMetodeData(method);
                      setShowCash(true);
                    }}>
                    <VStack justifyContent={'center'} alignItems={'center'}>
                      <FontAwesome name="money" size={40} />
                      <Text fontSize={30} fontWeight={'bold'}>
                        CASH
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </Box>
                <Box
                  h={150}
                  w={150}
                  p={5}
                  bgColor={'#FFF'}
                  shadow={4}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPayment(false);
                      setPaymentMethod('transfer');
                      setShowTrf(true);
                    }}>
                    <VStack justifyContent={'center'} alignItems={'center'}>
                      <FontAwesome name="bank" size={40} />
                      <Text fontSize={30} fontWeight={'bold'}>
                        TRF
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </Box>
                <Box
                  h={150}
                  w={150}
                  p={5}
                  bgColor={'#FFF'}
                  shadow={4}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPayment(false);
                      setPaymentMethod('debit');
                      setShowDebit(true);
                    }}>
                    <VStack justifyContent={'center'} alignItems={'center'}>
                      <FontAwesome name="credit-card" size={40} />
                      <Text fontSize={30} fontWeight={'bold'}>
                        DEBIT
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </Box>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showModalSummary}
        onClose={() => setShowModalSummary(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Total Penjualan</Modal.Header>
          <Modal.Body>
            <HStack justifyContent={'space-between'}>
              <Text fontSize={20}>Total</Text>
              <Text fontSize={20}>
                {new Intl.NumberFormat('id-ID').format(trxTotal)}
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontSize={20}>PPn</Text>
              <Text fontSize={20}>
                {new Intl.NumberFormat('id-ID').format(
                  isNaN(trxTax) ? 0 : trxTax,
                )}
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontSize={20}>Ongkir</Text>
              <Text fontSize={20}>
                {new Intl.NumberFormat('id-ID').format(
                  isNaN(trxOngkir) ? 0 : trxOngkir,
                )}
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontSize={20}>Diskon</Text>
              <Text fontSize={20} color={'#B42F2F'}>
                {new Intl.NumberFormat('id-ID').format(
                  isNaN(trxDiskon) ? 0 : trxDiskon,
                )}
              </Text>
            </HStack>

            <HStack justifyContent={'space-between'}>
              <Text fontSize={20}>Grand Total</Text>
              <Text fontSize={20} fontWeight={'bold'} color={'#0F7A1A'}>
                {new Intl.NumberFormat('id-ID').format(
                  trxTotal +
                    trxTax +
                    (isNaN(trxOngkir) ? 0 : trxOngkir) -
                    (isNaN(trxDiskon) ? 0 : trxDiskon),
                )}
              </Text>
            </HStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  // setShowModalSummary(false);
                  if (dataCart.length > 0) {
                    Alert.alert(
                      'Konfirmasi',
                      'Apakah Anda ingin menyimpan transaksi ke draft ? ',
                      [
                        {
                          text: 'Ya',
                          onPress: () => {
                            setShowModalSummary(!showModalSummary);
                            handleSaveAsDraft();
                          },
                        },
                        {
                          text: 'Tidak',
                          onPress: () => {},
                        },
                      ],
                    );
                  } else {
                    Alert.alert('Perhatian', 'Transaksi masih kosong');
                    return;
                  }
                }}>
                Lanjut
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/* <HStack space={4} alignItems={'center'} alignContent={'center'}>
        <Text mt={5}>CHECKOUT</Text>
      </HStack>

      <HStack flex={1} mt={5}>
        <Box w={'40%'} p={2} borderRadius={10}>
          <>
            <ListCheckout data={dataCart} />
          </>
        </Box>
      </HStack> */}
      <HStack justifyContent={'space-between'} mt={5}>
        <Box>
          <Text fontSize={RFPercentage(3)} fontWeight={'bold'}>
            CHECKOUT
          </Text>
        </Box>
        <Box>
          <Text>No.Transaksi</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {route.params.noTrx}
          </Text>
        </Box>
        <Box>
          <Text>Tanggal Transaksi</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {moment().format('DD MMMM YYYY')}
          </Text>
        </Box>
        <Box>
          <Text>Pelanggan</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {route.params.customer.nama}
          </Text>
        </Box>

        <HStack space={10}></HStack>
      </HStack>
      <Divider my={3} color={'#E2E2E2'} />
      <HStack justifyContent={'space-between'}>
        <Box>
          <Text>Nilai Transaksi</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(trxTotal)}
          </Text>
        </Box>
        <Box>
          <Text>PPn</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(trxTax)}
          </Text>
        </Box>
        <Box>
          <Text>Ongkir</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(trxOngkir)}
          </Text>
        </Box>
        <Box>
          <Text>Diskon</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(trxDiskon)}
          </Text>
        </Box>
        <Box>
          <Text>Grand Total</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(
              trxTotal +
                trxTax +
                (isNaN(trxOngkir) ? 0 : trxOngkir) -
                (isNaN(trxDiskon) ? 0 : trxDiskon),
            )}
          </Text>
        </Box>
        <Box>
          <Text>Uang Diterima</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {payment}
          </Text>
        </Box>
        <Box>
          <Text>Uang Kembali</Text>
          <Text fontSize={RFPercentage(1.5)} fontWeight={'bold'}>
            {new Intl.NumberFormat('id-ID').format(changePayment)}
          </Text>
        </Box>
      </HStack>
      <Divider my={3} color={'#E2E2E2'} />
      <HStack space={5}>
        <Box>
          <Text>Ongkir</Text>
          <Input
            size={'xs'}
            height={8}
            value={trxOngkir}
            backgroundColor={'#FFF'}
            onChangeText={val => setTrxOngkir(isNaN(val) ? 0 : parseInt(val))}
            keyboardType="number-pad"
            placeholder="Masukkan Ongkir"
            w={220}
          />
        </Box>
        <Box>
          <Text>Diskon</Text>
          <Input
            size={'xs'}
            height={8}
            backgroundColor={'#FFF'}
            onChangeText={val => setTrxDiskon(isNaN(val) ? 0 : parseInt(val))}
            keyboardType="number-pad"
            placeholder="Masukkan Diskon"
            w={220}
          />
        </Box>
        <Box>
          <Text></Text>
          <Button.Group>
            <Button
              size={'xs'}
              colorScheme={'info'}
              onPress={() => {
                calculatePPN();
                setShowModalSummary(true);
              }}>
              Simpan Ke Draft
            </Button>
            <Button
              size={'xs'}
              colorScheme={'success'}
              onPress={() => setShowPayment(!showPayment)}>
              Cetak Transaksi
            </Button>
          </Button.Group>
        </Box>
      </HStack>
      <Box flex={1} mt={3}>
        <ListCart
          data={dataCart}
          selectValue={handleSelectCheckbox}
          onDeleteItem={handleDeleteItem}
          onUpdateQty={handleSelectItem}
        />
      </Box>
      {/* </KeyboardAvoidingView> */}
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
    width: RFPercentage(30),
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
