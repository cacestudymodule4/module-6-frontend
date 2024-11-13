import axios from "axios";
import {takeLatest, put, call} from "redux-saga/effects";
import {
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    LOGIN,
    LOGIN_FAILED, LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    LOGOUT_SUCCESS, USER_INFO_FAILED, USER_INFO_REQUEST, USER_INFO_SUCCESS
} from "./actions";

const BaseURL = "http://localhost:8080";

function* loginSaga(action) {
    try {
        yield put({type: LOGIN_REQUEST});
        const response = yield call(axios.post, BaseURL + "/api/login", action.payload, {
            headers: {'Content-Type': 'application/json'}
        });
        const {token} = response.data;
        localStorage.setItem("jwtToken", token);
        yield put({type: LOGIN_SUCCESS, payload: response.data});
    } catch (error) {
        console.error("Đăng nhập thất bại", error);
        const errorMessage = error.response.data
        yield put({type: LOGIN_FAILED, payload: errorMessage});
    }
}

function* logoutSaga() {
    try {
        localStorage.removeItem('jwtToken');
        yield put({type: LOGOUT_SUCCESS});
    } catch (error) {
        console.error('Đăng xuất thất bại ', error);
    }
}

function* changePasswordSaga(action) {
    try {
        yield put({type: CHANGE_PASSWORD_REQUEST});
        const response = yield call(axios.put, BaseURL + '/api/change-password', action.payload, {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
        });
        yield put({type: CHANGE_PASSWORD_SUCCESS, payload: response.data});
    } catch (error) {
        const errorMessage = error.response.data
        yield put({type: CHANGE_PASSWORD_FAILURE, payload: errorMessage});
    }
}

function* userInfoSaga() {
    try {
        const response = yield call(axios.get, BaseURL + '/api/user/detail', {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
        });
        yield put({type: USER_INFO_SUCCESS, payload: response.data});
    } catch (error) {
        const errorMessage = error.response.data
        yield put({type: USER_INFO_FAILED, payload: errorMessage});
    }
}

export default function* rootSaga() {
    yield takeLatest(LOGIN, loginSaga);
    yield takeLatest(LOGOUT, logoutSaga);
    yield takeLatest(CHANGE_PASSWORD, changePasswordSaga);
    yield takeLatest(USER_INFO_REQUEST, userInfoSaga);
}