import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import Router from './src/router';

import Amplify, {Auth} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import config from './src/aws-exports';
Amplify.configure(config)

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <HomeScreen /> */}
      {/* <ShoppingCartScreen /> */}
      <Router />
    </View>
  );
};

export default withAuthenticator(App)
;
