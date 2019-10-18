



const brigadaReducer = (state=false, action)=>{
    switch(action.type){
        case 'NOTIFICATION':
            return state=action.payload
        default:
            return state
        
    }
}

export default brigadaReducer