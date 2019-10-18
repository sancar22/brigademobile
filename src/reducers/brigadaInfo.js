import _ from 'lodash'



const brigadaInfo = (state = null, action) => {
  switch (action.type) {
    case "SELECT_ONLINE": // Brigadistas online
      return  brigadeListOnline = action.payload
      ;
    default:
      return state;
  }
};

export default brigadaInfo;