import passwordChangeReducer from "./passwordChangeReducer";
import authReducer from "./authReducer";
import {combineReducers} from "redux";
import userInfoReducer from "./userInfo";

const rootReducer = combineReducers({
    auth: authReducer,
    passwordChange: passwordChangeReducer,
    userInfo: userInfoReducer,
});
export default rootReducer;