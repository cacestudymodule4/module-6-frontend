import axios from "axios";
import {takeLatest, put} from "redux-saga/effects";
import {
    LOGIN, LOGIN_FAILED,
    LOGIN_SUCCESS, LOGOUT
} from "../redux/action";

const BaseURL = "http://localhost:8080/api/login";

function* authSagaFun(action) {
    try {
        const user = action.payload;
        const response = yield axios.post(BaseURL, {...user}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const {token} = response.data;
        localStorage.setItem("jwtToken", token);
        yield put({type: LOGIN_SUCCESS, payload: response.data});
    } catch (error) {
        console.error("Login failed", error);
        yield put({type: LOGIN_FAILED, payload: error.response ? error.response.data : error.message});
    }
}

function* logOut(action) {
    try {
        const user = action.payload;
        localStorage.removeItem("jwtToken");
        yield put({type: LOGIN_SUCCESS, payload: {}});
    } catch (error) {

    }
}

export default function* rootSaga() {
    yield takeLatest(LOGIN, authSagaFun);
    yield takeLatest(LOGOUT, logOut)
}