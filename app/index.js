import React, {useState, useEffect} from 'react';
import {NativeBaseProvider, extendTheme, Root, Box, Center} from 'native-base';
import {StatusBar, LogBox, SafeAreaView} from 'react-native';
import Navigator from './routes/stack';

export default function App() {
  LogBox.ignoreAllLogs();
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: ({colorMode}) => {
          return {
            color: '#376FFF',
            opacity: 0.9,
            // fontWeight: "normal",
          };
        },
      },
      Text: {
        baseStyle: ({colorMode}) => {
          return {
            color: colorMode === 'dark' ? '#665b4f' : '#665b4f',
            fontWeight: 'normal',
          };
        },
      },
    },
    fontConfig: {
      Poppins: {
        100: {
          normal: 'Poppins-Book',
          italic: 'Poppins-BookItalic',
        },
        200: {
          normal: 'Poppins-Book',
          italic: 'Poppins-BookItalic',
        },
        300: {
          normal: 'Poppins-Book',
          italic: 'Poppins-BookItalic',
        },
        400: {
          normal: 'Poppins-SemiBold',
          italic: 'Poppins-Italic',
        },
        500: {
          normal: 'Poppins-Bold',
        },
        600: {
          normal: 'Poppins-Bold',
          italic: 'Poppins-MediumItalic',
        },

        700: {
          normal: 'Poppins-Bold',
        },
        800: {
          normal: 'Poppins-ExtraBold',
          italic: 'Poppins-ExtraBoldItalic',
        },
        900: {
          normal: 'Poppins-ExtraBold',
          italic: 'Poppins-ExtraBoldItalic',
        },
      },
    },

    // fonts: {
    //   heading: "Poppins",
    //   body: "Poppins",
    //   mono: "Poppins",
    // },
  });
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        translucent
        backgroundColor="#376FFF"
        barStyle="light-content"
      />
      <Navigator />
    </NativeBaseProvider>
  );
}
