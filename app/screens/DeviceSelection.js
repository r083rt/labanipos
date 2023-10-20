import React, {useState, useEffect} from 'react';

import {Box} from 'native-base';
import {ListDevice} from '../../components';
import realm from '../../models';
export default function DeviceSelection({route, navigation}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(route.params.devices);
  }, []);
  function handlePressItem(e) {
    const printers = realm.objects('PrinterSetting');
    if (printers.length > 0) {
      realm.write(() => {
        realm.delete(printers);
      });
    }
    realm.write(() => {
      realm.create(
        'PrinterSetting',
        {
          address: e.address,
          name: e.name,
        },
        true,
      );
    });
    navigation.goBack();
    route.params.checkPrinter();
    // route.params.connectPrinter(e.address, e.name);
  }
  return (
    <Box flex={1} backgroundColor="#F5F5F5">
      <ListDevice data={data} onPressItem={handlePressItem} />
    </Box>
  );
}
