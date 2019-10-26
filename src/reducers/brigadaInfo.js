import _ from 'lodash'



const brigadaInfo = (state = [], action) => {
  switch (action.type) {
    case "SELECT_ONLINE": // Brigadistas online
      return state = action.payload
      ;
    default:
      return state;
  }
};

export default brigadaInfo;