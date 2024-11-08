import passwordChangeReducer from "./passwordChangeReducer";
import authReducer from "./authReducer";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    passwordChange: passwordChangeReducer,
});
export default rootReducer;