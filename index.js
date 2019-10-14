/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import React from 'react';
import {createStore} from 'redux'
import allReducers from './src/reducers/index'





const AppContainer = () =>
        
        <App/>
        
   
AppRegistry.registerComponent(appName, () => AppContainer);
