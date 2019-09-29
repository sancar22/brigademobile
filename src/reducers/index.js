import {createStore, applyMiddleware} from 'redux';
import {thunkMiddleware} from 'redux-thunk'
import { Reducer } from 'react-native-router-flux';


// 
// initial states

const initialState ={


};

//


const Reducer = (state= initialState, action )=>{
return state;
}

const store = createStore(Reducer, applyMiddleware(thunkMiddleware));

export  {store};