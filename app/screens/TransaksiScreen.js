import React, {useState, useEffect, useCallback} from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Center,
  Button,
  Fab,
  Modal,
  KeyboardAvoidingView,
} from 'native-base';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ListReprint, ListTransaksi} from '../components';
import realm from '../models';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Alert, useWindowDimensions, BackHandler} from 'react-native';
import {background} from 'native-base/lib/typescript/theme/styled-system';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Transaksi({navigation, route}) {
  const layout = useWindowDimensions();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [dataReprintHeader, setDataReprintHeader] = useState(null);
  const [dataReprintDetail, setDataReprintDetail] = useState(null);
  const [dataTrx, setDataTrx] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Draft'},
    {key: 'second', title: 'Selesai'},
  ]);

  const connectToPrint = async () => {
    const printer = realm.objects('PrinterSetting');

    if (printer.length > 0) {
      await BluetoothManager.connect(printer[0].address);
    }
  };

  const handleSelectDraft = async e => {
    for (let i = 0; i < e.detail.length; i++) {
      const item = e.detail[i];
      await new Promise(resolve => {
        realm.write(() => {
          realm.create(
            'Cart',
            {
              id: item.id,
              id_transaksi: item.id_transaksi,
              item: item.item,
              nama_barang: item.nama_barang,
              jumlah: item.jumlah,
              satuan: item.satuan,
              harga_beli: item.harga_bual,
              harga_jual: item.harga_jual,
              subtotal: item.subtotal,
              ppn: item.ppn,
              status: item.status,
            },
            true,
          );
          resolve();
        });
      });
    }
    navigation.replace('Checkout', {
      customer: e.pelanggan,
      noTrx: e.id_transaksi,
    });
  };

  const handleViewHistory = e => {
    console.log('data history', e);
    setDataReprintHeader(e);
    setDataReprintDetail(e.detail);
    setShowModal(true);
  };

  const FirstRoute = () => (
    <Box flex={1} bgColor={'#F4F4F4'}>
      <ListTransaksi data={data} onPressItem={handleSelectDraft} />
    </Box>
  );

  const SecondRoute = () => (
    <Box flex={1} bgColor={'#F4F4F4'}>
      <ListTransaksi
        data={dataTrx}
        onPressItem={handleViewHistory}
        onReprintItem={reprint}
      />
    </Box>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useFocusEffect(
    useCallback(() => {
      getData();
      connectToPrint();
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.replace('Dashboard')}
          backgroundColor={'#376FFF'}
          leftIcon={<Icon name="arrow-left" color="#FFF" size={20} />}
          color="#fff"
        />
      ),
    });
    getData();
    connectToPrint();
    const backAction = () => {
      navigation.replace('Dashboard');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  async function reprint() {
    const connDevices = await BluetoothManager.getConnectedDeviceAddress();

    if (connDevices != '') {
      const noTrx = dataReprintHeader.id_transaksi;
      const storeData = realm.objects('Store');
      const store = storeData[0];

      const header = realm.objectForPrimaryKey('TransactionHeader', noTrx);
      const grandTotal =
        header.jlh_pembayaran + header.ongkir + header.pajak - header.diskon;
      const tglTransaksi = moment(header.tanggal).format('DD MMM YY HH:mm');
      const detail = realm
        .objects('TransactionDetail')
        .filtered("id_transaksi='" + noTrx + "'");

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

      // await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});

      // return;

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
          new Intl.NumberFormat('id-ID')
            .format(header.jlh_pembayaran)
            .toString(),
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
    } else {
      Alert.alert(
        'Perhatian',
        'Printer bluetooth belum terhubung. Periksa kembali di menu Settings',
      );
    }

    // navigation.replace('Dashboard');
  }

  const getData = () => {
    const draft = realm
      .objects('TransactionHeader')
      .filtered('status="draft"')
      .sorted('tanggal', true);

    setData(draft);
    const trx = realm
      .objects('TransactionHeader')
      .filtered('status="selesai"')
      .sorted('tanggal', true);
    setDataTrx(trx);
  };

  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={'xl'}>
        <KeyboardAvoidingView style={{width: '100%'}} behavior="position">
          <Center>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Detail Item</Modal.Header>
              <Modal.Body>
                <ListReprint data={dataReprintDetail} />
              </Modal.Body>
              <Modal.Footer>
                {dataReprintHeader ? (
                  <HStack>
                    <VStack mr={10}>
                      <Text>Total</Text>
                      <Text fontWeight={'bold'}>
                        {new Intl.NumberFormat('id-ID').format(
                          dataReprintHeader.jlh_pembayaran,
                        )}
                      </Text>
                    </VStack>
                    <VStack mr={10}>
                      <Text>Ongkir</Text>
                      <Text fontWeight={'bold'}>
                        {new Intl.NumberFormat('id-ID').format(
                          dataReprintHeader.ongkir,
                        )}
                      </Text>
                    </VStack>
                    <VStack mr={10}>
                      <Text>PPn</Text>
                      <Text fontWeight={'bold'}>
                        {new Intl.NumberFormat('id-ID').format(
                          dataReprintHeader.pajak,
                        )}
                      </Text>
                    </VStack>
                    <VStack mr={10}>
                      <Text>Diskon</Text>
                      <Text fontWeight={'bold'}>
                        {new Intl.NumberFormat('id-ID').format(
                          dataReprintHeader.diskon,
                        )}
                      </Text>
                    </VStack>
                    <Button
                      colorScheme={'success'}
                      onPress={() => {
                        reprint();
                      }}>
                      Print
                    </Button>
                  </HStack>
                ) : null}
              </Modal.Footer>
            </Modal.Content>
          </Center>
        </KeyboardAvoidingView>
      </Modal>
      <TabView
        swipeEnabled
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
      <Fab
        onPress={() => {
          navigation.replace('MasterCustomer', {
            type: 'transaksi',
          });
        }}
        bgColor={'#376FFF'}
        size={'lg'}
        position="absolute"
        icon={<Icon name="plus" size={30} color={'white'} />}
      />
    </>
  );
}
