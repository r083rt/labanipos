import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = axios.create({
  baseURL: __DEV__
    ? 'https://pos-demo.labani.net/api/'
    : 'https://pos-demo.labani.net/api/',
  timeout: 60000,
});

export default client;
