import React, {useState, useEffect} from 'react';
import {
  Box,
  KeyboardAvoidingView,
  Text,
  VStack,
  HStack,
  Button,
} from 'native-base';
import {Dimensions, Alert} from 'react-native';
export default function Pembayaran({navigation, route}) {
  const dim = Dimensions.get('screen');
  return (
    <Box flex={1} bgColor={'#F4F4F4'}>
      <KeyboardAvoidingView
        h={{
          base: '400px',
          lg: 'auto',
        }}
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }></KeyboardAvoidingView>
    </Box>
  );
}
