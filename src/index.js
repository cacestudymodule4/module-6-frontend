import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './components/uncommon/Home';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import store from "./redux/store";
import {Provider} from "react-redux";
import Staff from "./components/common/Staff";
import Contract from "./components/uncommon/Contract";
import ContractDetail from "./components/common/ContractDetail";
import AddContract from "./components/common/AddContract";
import Login from "./components/uncommon/Login";
import Logout from "./components/common/Logout";
import UserInfo from "./components/uncommon/UserDetail";
import Salary from "./components/uncommon/Salary";
import Chart8Component from "./components/uncommon/Report";
import CustomerList from "./components/uncommon/CustomerList";
import AddCustomer from "./components/uncommon/AddCustomer";
import AddStaff from "./components/uncommon/AddStaff";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <ToastContainer/>
            <Routes>
                <Route path="/staff/list" element={<Staff/>}/>
                <Route path="/staff/list/add" element={<AddStaff/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/user/detail" element={<UserInfo/>}/>
                <Route path="/customer/list" element={<CustomerList/>}/>
                <Route path="/customer/add" element={<AddCustomer/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/contract/add" element={<AddContract/>}/>
                <Route path="/contract/list" element={<Contract/>}/>
                <Route path="/contract/detail/:id" element={<ContractDetail/>}/>
                <Route path="/user/detail" element={<UserInfo/>}/>
                <Route path="/salary" element={<Salary/>}/>
                <Route path="/report" element={<Chart8Component/>}/>
                <Route path="/*" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
