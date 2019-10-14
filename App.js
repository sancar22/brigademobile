import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import Routes from './src/routes/Routes';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import allReducers from './src/reducers/index'





const store = createStore(allReducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

class App extends Component {
  
   render() {
   
      return (
        <Provider store={store}>
         <Routes />
         </Provider>
      )
   }
}

export default App
