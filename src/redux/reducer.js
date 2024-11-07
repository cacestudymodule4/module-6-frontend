import {LOGIN_FAILED, LOGIN_SUCCESS} from "./action";

const initialState = {
    userLogin: {},
    error: {}
};
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {...state, userLogin: action.payload};
        case LOGIN_FAILED:
            return {...state, error: action.payload};
        default:
            return state;
    }
};
export default rootReducer;