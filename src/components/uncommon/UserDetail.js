import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {USER_INFO_REQUEST} from "../../redux/actions";
import {useNavigate} from "react-router-dom";
import ChangePassword from './ChangePassword';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

const MyDialogComponent = ({isOpen, onClose}) => {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [isOpen]);
    return (
        <dialog ref={dialogRef} onClose={onClose}
                style={{borderRadius: '8px', padding: '20px', width: "850px"}}>
            <ChangePassword/>
            <div className={"d-flex justify-content-end"}>
                <button onClick={onClose} className="btn btn-secondary mt-3">Đóng</button>
            </div>
        </dialog>
    );
};
const UserInfo = () => {
    const {userInfo, error} = useSelector(state => state.userInfo);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        dispatch({type: USER_INFO_REQUEST});
        if (error) {
            toast.error("Không thể tải thông tin người dùng", {position: "top-right", autoClose: 3000});
        }
    }, [userInfo, error]);
    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);
    return (
        <><NavbarApp></NavbarApp>
            <section className="bg-light p-3 p-md-4 p-xl-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xxl-8">
                            <div className="card border-light-subtle shadow-sm">
                                <div className="card-body p-3 p-md-4 p-xl-5">
                                    <h2 className="h4 text-center">Thông Tin Người Dùng</h2>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userInfo?.fullName || ''}
                                                    disabled
                                                />
                                                <label>Họ và tên</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userInfo?.email || ''}
                                                    disabled
                                                />
                                                <label>Email</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userInfo?.phone || ''}
                                                    disabled
                                                />
                                                <label>Số điện thoại</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userInfo?.identification || ''}
                                                    disabled
                                                />
                                                <label>CMND/CCCD</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userInfo?.gender ? 'Nam' : 'Nữ'}
                                                    disabled
                                                />
                                                <label>Giới tính</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userInfo?.id || ''}
                                                    disabled
                                                />
                                                <label>ID</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={openDialog} className="btn btn-dark btn-lg w-100">Đổi Mật Khẩu
                                    </button>
                                    <MyDialogComponent isOpen={isDialogOpen} onClose={closeDialog}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </>
    );
};
export default UserInfo;
