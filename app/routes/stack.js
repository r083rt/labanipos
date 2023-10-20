import React from 'react';
import {Button} from 'native-base';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Login from '../screens/LoginScreen';
import LupaPassword from '../screens/LupaPasswordScreen';
import Dashboard from '../screens/DashboardScreen';
import GantiPassword from '../screens/GantiPasswordScreen';
import Profile from '../screens/ProfileScreen';
import Kasir from '../screens/KasirScreen';
import GetData from '../screens/GetDataScreen';
import MasterCustomer from '../screens/MasterCustomerScreen';
import Transaksi from '../screens/TransaksiScreen';
import Checkout from '../screens/CheckoutScreen';
import SettingPrinter from '../screens/SettingPrinterScreen';
import Closing from '../screens/ClosingScreen';
import Backend from '../screens/BackendScreen';
import NewCustomer from '../screens/NewCustomerScreen';
import ReportSales from '../screens/ReportSalesScreen';
import JurnalKas from '../screens/JurnalKasScreen';
import ReportJurnal from '../screens/ReportJurnalKasScreen';

const Stack = createStackNavigator();

function MainStackNavigator({navigation, route}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          animation: 'none',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          animationEnabled: false,
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GetData"
          component={GetData}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LupaPassword"
          component={LupaPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GantiPassword"
          component={GantiPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'DASHBOARD',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="MasterCustomer"
          component={MasterCustomer}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'MASTER CUSTOMER',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Kasir"
          component={Kasir}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Transaksi"
          component={Transaksi}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            headerLeft: () => (
              <Button
                backgroundColor={'#376FFF'}
                leftIcon={<Icon name="arrow-left" color="#FFF" size={30} />}
                color="#fff"
              />
            ),
            title: 'LIST TRANSAKSI',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SettingPrinter"
          component={SettingPrinter}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'SETTING PRINTER',
          }}
        />
        <Stack.Screen
          name="Closing"
          component={Closing}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'TUTUP BUKU',
          }}
        />
        <Stack.Screen
          name="Backend"
          component={Backend}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'BACK END',
          }}
        />
        <Stack.Screen
          name="ReportSales"
          component={ReportSales}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'LAPORAN PENJUALAN',
          }}
        />
        <Stack.Screen
          name="ReportJurnal"
          component={ReportJurnal}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'LAPORAN JURNAL KAS',
          }}
        />
        <Stack.Screen
          name="JurnalKas"
          component={JurnalKas}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'JURNAL KAS',
          }}
        />
        <Stack.Screen
          name="NewCustomer"
          component={NewCustomer}
          options={{
            headerStyle: {
              backgroundColor: '#376FFF',
            },
            title: 'DATA PELANGGAN',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default MainStackNavigator;
