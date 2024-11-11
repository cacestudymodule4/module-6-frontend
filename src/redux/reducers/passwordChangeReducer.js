import {CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS} from "../actions";

const initialPasswordChangeState = {
    success: false,
    error: null,
    isSubmitting: false,
};
const passwordChangeReducer = (state = initialPasswordChangeState, action) => {
    switch (action.type) {
        case CHANGE_PASSWORD_SUCCESS:
            return {...state, success: true, error: null, isSubmitting: false};
        case CHANGE_PASSWORD_FAILURE:
            return {...state, success: false, error: action.payload, isSubmitting: false};
        case CHANGE_PASSWORD_REQUEST:
            return {...state, success: false, error: null, isSubmitting: true};
        default:
            return state;
    }
};
export default passwordChangeReducer;

