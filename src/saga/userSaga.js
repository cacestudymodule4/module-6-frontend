import axios from "axios";
import {put, takeLatest, select} from "redux-saga/effects";
import {
    CREATE_USER,
    DELETE, EDIT_USER,
    FETCH_USER,
    FETCH_USER_SUCCESS,
    LOGIN,
    LOGIN_SUCCESS
} from "../redux/action";

const BaseURL = "http://localhost:3000/users";

function* getUser(action) {
    try {
        const response = yield axios.get(BaseURL);
        yield put({type: FETCH_USER_SUCCESS, payload: response.data});
    } catch (error) {
        console.log("error - getUser : ", error);
    }
}

function* authSagaFun(action) {
    const user = action.payload;
    if (user.username === "admin" && user.password === "admin") {
        yield put({type: LOGIN_SUCCESS, payload: user});
        yield put({type: FETCH_USER, payload: {}});
    }
}

function* deleteUser(action) {
    try {
        yield axios.delete(BaseURL + "/" + action.payload.id);
        const response = yield axios.get(BaseURL);
        yield put({type: FETCH_USER_SUCCESS, payload: response.data});
    } catch (error) {
        console.log("error - getUser : ", error);
    }
}

function* createUser(action) {
    try {
        yield axios.post(BaseURL, action.payload);
        const response = yield axios.get(BaseURL);
        yield put({type: FETCH_USER_SUCCESS, payload: response.data});
    } catch (error) {
        console.log("error - getUser : ", error);
    }
}

function* editUser(action) {
    try {
        console.log(BaseURL + "/" + action.payload.id, action.payload)
        yield axios.put(BaseURL + "/" + action.payload.id, action.payload);
        const response = yield axios.get(BaseURL);
        yield put({type: FETCH_USER_SUCCESS, payload: response.data});
    } catch (error) {
        console.log("error - getUser : ", error);
    }
}

export default function* rootSaga() {
    yield takeLatest(LOGIN, authSagaFun);
    yield takeLatest(FETCH_USER, getUser);
    yield takeLatest(DELETE, deleteUser);
    yield takeLatest(CREATE_USER, createUser);
    yield takeLatest(EDIT_USER, editUser);
}