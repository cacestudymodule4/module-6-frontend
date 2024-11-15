import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";

const StaffRegister = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Tên người dùng không được để trống"),
        fullName: Yup.string().required("Họ và tên không được để trống"),
        email: Yup.string()
            .email("Email phải có định dạng hợp lệ, ví dụ: example@domain.com")
            .required("Email không được để trống"),
        phone: Yup.string()
            .matches(/^(09|08)\d{8}$/, "Số điện thoại phải bắt đầu bằng 09 hoặc 08 và có 10 số")
            .required("Số điện thoại không được để trống"),
        identification: Yup.string()
            .matches(/^\d{1,12}$/, "CMND/CCCD phải có tối đa 12 số")
            .required("CMND/CCCD không được để trống"),
        password: Yup.string().required("Mật khẩu không được để trống"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Xác nhận mật khẩu không khớp với mật khẩu")
            .required("Xác nhận mật khẩu không được để trống"),
        gender: Yup.string().required("Giới tính không được để trống"),
    });

    const handleSubmit = async (values, {setSubmitting, setErrors}) => {
        try {
            await axios.post("http://localhost:8080/api/register", values, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            });
            navigate("/home");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data);
            } else {
                console.error("Đã xảy ra lỗi", error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="container my-5 rounded p-3 shadow bg-light" style={{maxWidth: "500px"}}>
                <h3 className="text-center text-white py-3 bg-success rounded mb-4" style={{fontSize: "2rem"}}>
                    Đăng ký người dùng
                </h3>
                <Formik
                    initialValues={{
                        username: "",
                        fullName: "",
                        email: "",
                        phone: "",
                        identification: "",
                        password: "",
                        confirmPassword: "",
                        gender: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}>
                    {({isSubmitting}) => (
                        <Form className="p-3 border rounded shadow-sm bg-white">
                            <div className="mb-2">
                                <label className="form-label fw-bold">Tên người dùng</label>
                                <Field type="text" name="username" className="form-control"/>
                                <ErrorMessage name="username" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">Họ và tên</label>
                                <Field type="text" name="fullName" className="form-control"/>
                                <ErrorMessage name="fullName" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">Email</label>
                                <Field type="email" name="email" className="form-control"/>
                                <ErrorMessage name="email" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">Số điện thoại</label>
                                <Field type="text" name="phone" className="form-control"/>
                                <ErrorMessage name="phone" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">CMND/CCCD</label>
                                <Field type="text" name="identification" className="form-control"/>
                                <ErrorMessage name="identification" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">Mật khẩu</label>
                                <Field type="password" name="password" className="form-control"/>
                                <ErrorMessage name="password" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">Nhập lại mật khẩu</label>
                                <Field type="password" name="confirmPassword" className="form-control"/>
                                <ErrorMessage name="confirmPassword" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label fw-bold">Giới tính:</label>
                                <div className="form-check">
                                    <Field type="radio" name="gender" value="true" className="form-check-input"/>
                                    <label className="form-check-label">Nam</label>
                                </div>
                                <div className="form-check">
                                    <Field type="radio" name="gender" value="false" className="form-check-input"/>
                                    <label className="form-check-label">Nữ</label>
                                </div>
                                <ErrorMessage name="gender" component="div" className="text-danger"/>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button type="submit" className="btn btn-success w-75 rounded-pill"
                                        disabled={isSubmitting}>
                                    {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <Footer/>
        </>
    );
};
export default StaffRegister;
