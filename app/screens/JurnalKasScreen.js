import React, {useState, useEffect, useRef} from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Select,
  Button,
  Input,
  Divider,
  useToast,
} from 'native-base';
import {Alert} from 'react-native';
import {ListJurnal} from '../components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import realm from '../models';
import {saveJurnalAPI, saveTransactionAPI} from '../apis/transaction';

export default function JurnalKas({navigation, route}) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const [jurnalDate, setJurnalDate] = useState('');
  const [show, setShow] = useState(false);
  const [tipe, setTipe] = useState('');

  const [pos, setPos] = useState('');
  const [metodeTrans, setMetodeTrans] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [nominal, setNominal] = useState(0);
  const [dataJurnal, setDataJurnal] = useState([]);
  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current._root.clear(); // This will clear the input
    }
  };

  useEffect(() => {
    const method = realm.objects('TransMethod');
    setMethodData(method);
  }, []);

  const [posData, setPosData] = useState([]);
  const [methodData, setMethodData] = useState([]);

  const handleInputJurnal = () => {
    console.log(pos);
    console.log(metodeTrans);

    const posinputString = pos;
    const pospipeIndex = posinputString.indexOf('|');
    const posval = posinputString.substring(0, pospipeIndex);
    const poslabel = posinputString.substring(pospipeIndex + 1);
    const posID = posval;
    const posName = poslabel;

    const metodeinputString = metodeTrans;
    const metodepipeIndex = metodeinputString.indexOf('|');
    const metodeval = metodeinputString.substring(0, metodepipeIndex);
    const metodelabel = metodeinputString.substring(metodepipeIndex + 1);
    const metodetID = metodeval;
    const metodeName = metodelabel;

    if (jurnalDate === '') {
      Alert.alert('Perhatian', 'Tanggal Jurnal belum dipilih.');
      return;
    }
    if (tipe === '') {
      Alert.alert('Perhatian', 'Tipe jurnal belum dipilih.');
      return;
    }

    if (pos === '') {
      Alert.alert('Perhatian', 'Pos belum dipilih.');
      return;
    }

    if (metodeTrans === '') {
      Alert.alert('Perhatian', 'Metode transaksi belum dipilih.');
      return;
    }

    if (keterangan === '') {
      Alert.alert('Perhatian', 'Keterangan belum diisi.');
      return;
    }

    if (nominal === 0) {
      Alert.alert('Perhatian', 'Nominal tidak boleh kosong.');
      return;
    }

    const newItem = {
      id: moment().format('YYYYMMDDHHmmss'),
      tanggal: moment(jurnalDate).format('YYYY-MM-DD'),
      tipe: tipe,
      pos: posName,
      id_pos: posID,
      id_metode: metodetID,
      metode: metodeName,
      keterangan: keterangan,
      nominal: parseInt(nominal),
    };

    setDataJurnal(prevArray => {
      const updatedArray = [...prevArray, newItem];
      return updatedArray;
    });

    // setJurnalDate('');
    setKeterangan('');
    setTipe('');
    setPos('');
    setNominal('');
    setMetodeTrans('');
    // clearInput();
  };

  const handleDeleteInput = e => {
    var itemIndex = dataJurnal.findIndex(x => x.id == e.id);

    if (itemIndex !== -1) {
      dataJurnal.splice(itemIndex, 1);
    }
    setDataJurnal(prevArray => [...prevArray]);
    const jDetail = realm.objectForPrimaryKey('CashJournal', e.id);
    if (jDetail) {
      realm.write(() => {
        realm.delete(jDetail);
      });
    }
  };

  const handleSaveDraft = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda ingin menyimpan draft jurnal ?', [
      {
        text: 'Ya',
        onPress: () => {
          const trxDetail = dataJurnal.map(item => {
            return {
              id: item.id,
              tanggal: item.tanggal,
              tipe: item.tipe,
              pos: item.pos,
              id_pos: item.id_pos,
              id_metode: item.id_metode,
              metode: item.metode,
              keterangan: item.keterangan,
              nominal: parseInt(item.nominal),
            };
          });

          realm.write(() => {
            realm.create(
              'JournalHeader',
              {
                tanggal: moment(jurnalDate).format('YYYY-MM-DD'),
                detail: trxDetail,
              },
              true,
            );
          });

          navigation.replace('Dashboard');
        },
      },
      {
        text: 'Tidak',
        onPress: () => {},
      },
    ]);
  };

  const handleSaveJurnal = () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda ingin menyimpan dan mengirim data jurnal ?',
      [
        {
          text: 'Ya',
          onPress: async () => {
            const trxDetail = dataJurnal.map(item => {
              return {
                id: item.id,
                tanggal: item.tanggal,
                tipe: item.tipe,
                pos: item.pos,
                id_pos: item.id_pos,
                id_metode: item.id_metode,
                metode: item.metode,
                keterangan: item.keterangan,
                nominal: parseInt(item.nominal),
              };
            });
            const detailParam = dataJurnal.map(item => {
              return {
                jenis_transaksi: item.tipe,
                keterangan: item.keterangan,
                metode_transaksi: item.id_metode,
                pos: item.id_pos,
                nominal: item.nominal,
              };
            });

            realm.write(() => {
              realm.create(
                'JournalHeader',
                {
                  tanggal: moment(jurnalDate).format('YYYY-MM-DD'),
                  detail: trxDetail,
                },
                true,
              );
            });
            try {
              setIsLoading(true);
              const response = await saveJurnalAPI({
                tanggal: moment(jurnalDate).format('YYYY-MM-DD'),
                trx_detail: detailParam,
              });

              if (response.data.status === 'SUCCESS') {
                const jurnalDetail = realm.objects('CashJournal');
                jurnalDetail.forEach(item => {
                  realm.write(() => {
                    realm.delete(item);
                  });
                });
                const jurnalHeader = realm.objectForPrimaryKey(
                  'JournalHeader',
                  moment().format('YYYY-MM-DD'),
                );

                realm.write(() => {
                  realm.delete(jurnalHeader);
                });
                setIsLoading(false);
                toast.show({
                  title: 'Sukses',
                  description: response.data.description,
                });
                navigation.replace('Dashboard');
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
              setIsLoading(false);
              toast.show({
                title: 'Gagal',
                description: 'Order gagal disimpan. (' + error + ')',
              });
              navigation.replace('Dashboard');
            }
          },
        },
        {
          text: 'Tidak',
          onPress: () => {},
        },
      ],
    );
  };

  const getData = dt => {
    console.log(dt);
    const trxDetail = realm
      .objects('CashJournal')
      .filtered("tanggal='" + dt + "'");

    console.log(trxDetail);

    setDataJurnal(trxDetail);
    setDataJurnal(prevArray => [...prevArray]);
  };

  return (
    <Box flex={1} bgColor={'#F4F4F4'}>
      <DatePicker
        modal
        mode="date"
        open={show}
        date={new Date()}
        locale="id"
        onConfirm={date => {
          setJurnalDate(date);
          setShow(false);
          getData(moment(date).format('YYYY-MM-DD'));
        }}
        onCancel={() => {
          setShow(false);
        }}
      />
      <Box m={3} bgColor={'#FFFFFF'} borderRadius={10} p={5} mb={0}>
        <HStack space={3}>
          <VStack space={2}>
            <Text>Tgl.Jurnal</Text>
            <HStack mt={1} alignItems={'center'} space={3}>
              <Input
                onChangeText={() => {
                  setJurnalDate('');
                }}
                onFocus={() => {
                  setShow(true);
                }}
                w={150}
                placeholder="Tanggal jurnal">
                {jurnalDate != ''
                  ? moment(jurnalDate).format('DD MMMM YYYY')
                  : ''}
              </Input>
            </HStack>
          </VStack>
          <VStack space={2}>
            <Text>Tipe</Text>
            <Select
              selectedValue={tipe}
              minWidth="200"
              accessibilityLabel="Pilih tipe jurnal"
              placeholder="Pilih tipe jurnal"
              mt={1}
              onValueChange={itemValue => {
                const pos = realm
                  .objects('JournalPos')
                  .filtered("tipe='" + itemValue + "'")
                  .sorted('nama');
                setPosData(pos);
                setTipe(itemValue);
              }}>
              <Select.Item label="Penerimaan" value="penerimaan" />
              <Select.Item label="Pengeluaran" value="pengeluaran" />
            </Select>
          </VStack>
          <VStack space={2}>
            <Text>Pos</Text>
            <Select
              selectedValue={pos}
              minWidth="350"
              accessibilityLabel="Pilih Pos"
              placeholder="Pilih Pos"
              mt={1}
              onValueChange={itemValue => {
                setPos(itemValue);
              }}>
              {posData.map(val => {
                return (
                  <Select.Item
                    label={val.nama}
                    value={val.akun_id + '|' + val.nama}
                    key={val.id}
                  />
                );
              })}
            </Select>
          </VStack>
          <VStack space={2}>
            <Text>Metode Transaksi</Text>
            <Select
              selectedValue={metodeTrans}
              minWidth="350"
              accessibilityLabel="Pilih Metode Transaksi"
              placeholder="Pilih Metode Transaksi"
              mt={1}
              onValueChange={itemValue => setMetodeTrans(itemValue)}>
              {methodData.map(val => {
                return (
                  <Select.Item
                    label={val.nama}
                    value={val.akun_id + '|' + val.nama}
                    key={val.akun_id}
                  />
                );
              })}
            </Select>
          </VStack>
        </HStack>
        <Divider my={5} />
        <HStack space={3}>
          <VStack space={2} w={500}>
            <Text>Keterangan</Text>
            <Input
              mt={1}
              value={keterangan}
              placeholder="Input keterangan"
              onChangeText={text => setKeterangan(text)}
            />
          </VStack>
          <VStack space={2} w={250}>
            <Text>Nominal</Text>
            <Input
              keyboardType="number-pad"
              mt={1}
              value={nominal}
              placeholder="Input Nominal"
              onChangeText={text => setNominal(parseInt(text))}
            />
          </VStack>
          <VStack space={2} w={150} mt={1}>
            <Text></Text>
            <Button mt={1} colorScheme={'success'} onPress={handleInputJurnal}>
              Tambah
            </Button>
          </VStack>
        </HStack>
      </Box>
      <Box flex={1} m={3} bgColor={'#FFFFFF'} borderRadius={10} p={5} mb={0}>
        <ListJurnal data={dataJurnal} onDeleteItem={handleDeleteInput} />
      </Box>
      <Box
        m={3}
        bgColor={'#FFFFFF'}
        borderRadius={10}
        p={5}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <Button.Group>
          <Button
            isLoading={isLoading}
            w={'32%'}
            colorScheme={'info'}
            onPress={handleSaveDraft}>
            Simpan Draft
          </Button>
          <Button
            isLoading={isLoading}
            w={'32%'}
            colorScheme={'success'}
            onPress={handleSaveJurnal}>
            Simpan dan Kirim
          </Button>
          <Button
            isLoading={isLoading}
            w={'32%'}
            colorScheme={'danger'}
            onPress={() => {
              navigation.replace('Dashboard');
            }}>
            Batal
          </Button>
        </Button.Group>
      </Box>
    </Box>
  );
}
