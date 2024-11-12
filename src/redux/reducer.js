import passwordChangeReducer from "./reducers/passwordChangeReducer";
import authReducer from "./reducers/authReducer";
import {combineReducers} from "redux";
import userInfoReducer from "./reducers/userInfo";

const rootReducer = combineReducers({
    auth: authReducer,
    passwordChange: passwordChangeReducer,
    userInfo: userInfoReducer,
});
export default rootReducer;