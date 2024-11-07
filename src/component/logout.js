import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {LOGOUT} from "../redux/action";

const Logout = () => {
    const userLogin = useSelector(state => state.userLogin);
    const error = useSelector(state => state.error);
    const logOut = () => {
        dispatch({type: LOGOUT, payload: {}});
    }
    return (
        <>
            <button onClick={}>Logout</button>
        </>
    )
}