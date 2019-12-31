/* eslint-disable react/react-in-jsx-scope */
/**
 * @format
 */
import "react-native-gesture-handler"
import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react'
import store from './store/index';
import {Provider} from 'react-redux';
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Root);
