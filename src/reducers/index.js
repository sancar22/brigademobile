import brigadaReducer from "./brigada";
import fillCaseInfoReducer from "./caseInfo";
import brigadaInfo from "./brigadaInfo";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  brigada: brigadaReducer,
  case: fillCaseInfoReducer,
  info: brigadaInfo,
});

export default allReducers;
