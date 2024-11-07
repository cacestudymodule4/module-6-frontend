import {LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS} from "./actions";

const initialState = {
    user: null,
    isAuthenticated: false,
    error: null,
    isLoggingIn: false
};
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                error: null
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoggingIn: false,
                error: null
            };
        case LOGIN_FAILED:
            return {
                ...state,
                isLoggingIn: false,
                error: action.payload
            };
        case LOGOUT_SUCCESS:
            return initialState;
        default:
            return state;
    }
};
export default authReducer;
