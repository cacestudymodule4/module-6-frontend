import {
    USER_INFO_FAILED,
    USER_INFO_SUCCESS
} from "./actions";

const initialState = {
    userInfo: null,
    error: null
};
const userInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_INFO_SUCCESS:
            return {
                ...state,
                userInfo: action.payload,
                error: null
            };
        case USER_INFO_FAILED:
            return {
                ...state,
                userInfo: null,
                error: action.payload
            };
        default:
            return state;
    }
};
export default userInfoReducer;