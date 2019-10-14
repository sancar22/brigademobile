import brigadaReducer from './brigada'
import {combineReducers} from 'redux'



const allReducers = combineReducers({
    brigada: brigadaReducer
}
)

export default allReducers


