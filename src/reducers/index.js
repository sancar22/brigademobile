import brigadaReducer from "./brigada";
import fillCaseInfoReducer from "./caseInfo";
import brigadaInfo from "./brigadaInfo";
import allBrigaders from "./allBrigaders";
import { combineReducers } from "redux";

const allReducers = combineReducers({
    brigada: brigadaReducer,
    case: fillCaseInfoReducer,
    info: brigadaInfo,
    allInfo: allBrigaders
});

export default allReducers;
