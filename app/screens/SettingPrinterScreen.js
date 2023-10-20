import React, {useState, useEffect} from 'react';
import {Box, Text, HStack, VStack, Heading, Button} from 'native-base';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from '@brooons/react-native-bluetooth-escpos-printer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native';
import realm from '../models';
import {ListDevices} from '../components';
export default function SettingPrinter({navigation, route}) {
  const [printer, setPrinter] = useState({
    name: '',
    address: '',
  });

  const [btDevices, setBTDevices] = useState([]);

  const getBTDevices = async () => {
    const devices = await BluetoothManager.enableBluetooth();
    return devices
      .reduce((acc, device) => {
        try {
          return [...acc, JSON.parse(device)];
        } catch (e) {
          return acc;
        }
      }, [])
      .filter(device => device.address);
  };

  useEffect(() => {
    checkActivePrinter();
    checkBluetooth();
  }, []);

  const checkActivePrinter = () => {
    const p = realm.objects('PrinterSetting');

    if (p.length > 0) {
      setPrinter(p[0]);
    }
  };

  const checkBluetooth = async () => {
    const isEnabled = await BluetoothManager.checkBluetoothEnabled();

    if (isEnabled === true) {
      const devices = await getBTDevices();
      console.log(devices);
      setBTDevices(devices);
    }

    console.log('BT Dvice', btDevices);
  };
  const handleSelectDevice = e => {
    realm.write(() => {
      realm.create(
        'PrinterSetting',
        {
          name: e.name,
          address: e.address,
        },
        true,
      );
    });
    checkActivePrinter();
  };

  const handleTestPrint = async () => {
    const printer = realm.objects('PrinterSetting');

    await BluetoothManager.connect(printer[0].address);
    const connDevice = await BluetoothManager.getConnectedDeviceAddress();
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printText('TEST PRINT' + '\n', {
      fonttype: 1,
      printerAlign: 'left',
    });
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
  };

  const deletePrinter = () => {
    const printer = realm.objects('PrinterSetting');
    realm.write(() => {
      realm.delete(printer[0]);
    });
    setPrinter({
      name: '',
      address: '',
    });
    checkActivePrinter();
  };
  return (
    <Box flex={1}>
      <Box p={3} m={2} flex={1}>
        {printer.name != '' ? (
          <HStack space={5} alignItems={'center'}>
            <Icon name="print" size={30} />
            <VStack w={'70%'}>
              <Text fontSize={20} fontWeight={'bold'}>
                {printer.name}
              </Text>
              <Text>{printer.address}</Text>
            </VStack>
            <Button.Group>
              <Button onPress={handleTestPrint}>Test</Button>
              <Button onPress={deletePrinter} colorScheme={'danger'}>
                Hapus
              </Button>
            </Button.Group>
          </HStack>
        ) : (
          <VStack flex={1}>
            <Text>Pilih Bluetooth Printer</Text>
            <ListDevices data={btDevices} onPressItem={handleSelectDevice} />
          </VStack>
        )}
        {/* <VStack flex={1}>
          <Text>Pilih Bluetooth Printer</Text>
          <ListDevices data={btDevices} onPressItem={handleSelectDevice} />
        </VStack> */}
      </Box>
      {/* <Button onPress={handleTestPrint}>Test print</Button> */}
    </Box>
  );
}
