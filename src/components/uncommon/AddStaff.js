import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import {useNavigate} from "react-router-dom";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";

const AddStaff = () => {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const initialValues = {
        name: "",
        gender: true,
        birthDate: "",
        address: "",
        phone: "",
        email: "",
        salary: "",
        startDate: ""
    };

    const validationSchema = Yup.object({
        codeStaff: Yup.string()
            .required("Xin hãy nhập mã NV")
            .matches(/^NV-\d{3}$/, "Mã nhân viên phải có định dạng 'NV-XXX', trong đó XXX là 3 chữ số"),

        name: Yup.string()
            .required("Xin vui lòng nhập tên")
            .min(1, "Tên phải có ít nhất 1 ký tự")
            .max(50, "Tên không được vượt quá 50 ký tự"),

        birthDate: Yup.date()
            .required("Xin vui lòng nhập ngày sinh")
            .max(new Date(), "Ngày sinh không được ở tương lai"),

        address: Yup.string()
            .required("Xin vui lòng nhập địa chỉ")
            .min(3, "Địa chỉ phải có ít nhất 3 ký tự"),

        phone: Yup.string()
            .required("Xin vui lòng nhập số điện thoại")
            .matches(/^(09|08)[0-9]{8}$/, "Số điện thoại phải bắt đầu bằng 09 hoặc 08 và có đúng 10 chữ số"),

        email: Yup.string()
            .email("Email không được chứa dấu")
            .required("Xin vui lòng nhập email")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Email phải có định dạng hợp lệ, ví dụ: example@domain.com"
            )
            .max(50, "Email không được vượt quá 50 ký tự"),

        salary: Yup.number()
            .required("Xin vui lòng nhập lương")
            .positive("Lương phải là số dương")
            .min(1000, "Lương thấp nhất là 1000 VNĐ")
            .max(100000000, "Lương không được vượt quá 100 triệu VNĐ"),

        startDate: Yup.date()
            .required("Xin vui lòng nhập ngày bắt đầu làm việc")
            .max(new Date(), "Ngày bắt đầu không được ở tương lai")
    });

    const addEmployee = async (values) => {
        try {
            const response = await axios.post('http://localhost:8080/api/staff/add', values, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Nhân viên mới đã được thêm thành công!!!");
                setIsAddModalOpen(false);
                navigate('/staff/list');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data);
            } else {
                toast.error("Xin bạn hãy kiểm tra lại Tên, Email, Số điện thoại");
            }
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="container my-5 rounded p-4" style={{maxWidth: '800px'}}>
                <h3 className="text-center text-white py-3 bg-success rounded mb-5" style={{fontSize: '2.15rem'}}>
                    Thêm Nhân Viên Mới
                </h3>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={addEmployee}
                >
                    <FormikForm>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Mã nhân viên</label>
                                    <Field type="text" name="codeStaff" className="form-control form-control-lg"/>
                                    <ErrorMessage name="codeStaff" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Họ và Tên</label>
                                    <Field type="text" name="name" className="form-control form-control-lg"/>
                                    <ErrorMessage name="name" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Ngày sinh</label>
                                    <Field type="date" name="birthDate" className="form-control form-control-lg"/>
                                    <ErrorMessage name="birthDate" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Email</label>
                                    <Field type="email" name="email" className="form-control form-control-lg"/>
                                    <ErrorMessage name="email" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Số điện thoại</label>
                                    <Field type="text" name="phone" className="form-control form-control-lg"/>
                                    <ErrorMessage name="phone" component="div" className="text-danger small"/>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Địa chỉ</label>
                                    <Field type="text" name="address" className="form-control form-control-lg"/>
                                    <ErrorMessage name="address" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Lương</label>
                                    <div className="input-group">
                                        <Field type="number" name="salary" className="form-control form-control-lg"/>
                                        <span className="input-group-text">VNĐ</span>
                                    </div>
                                    <ErrorMessage name="salary" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Ngày bắt đầu</label>
                                    <Field type="date" name="startDate" className="form-control form-control-lg"/>
                                    <ErrorMessage name="startDate" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Bộ phận</label>
                                    <Field as="select" name="position" className="form-select form-select-lg">
                                        <option value="Manager">Quản lý</option>
                                        <option value="Staff">Nhân viên</option>
                                        <option value="HR">Nhân sự</option>
                                        <option value="IT">IT</option>
                                    </Field>
                                    <ErrorMessage name="position" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Giới tính</label>
                                    <Field as="select" name="gender" className="form-select form-select-lg">
                                        <option value={true}>Nam</option>
                                        <option value={false}>Nữ</option>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button
                                type="button"
                                className="btn btn-outline-success btn-lg me-2"
                                onClick={() => navigate("/staff/list")}>
                                <i className="bi bi-arrow-left-circle me-2"></i>
                                Trở lại
                            </button>

                            <button type="submit" className="btn btn-outline-success btn-lg">
                                Thêm <i className="bi bi-plus-circle"></i>
                            </button>
                        </div>
                    </FormikForm>
                </Formik>
            </div>
            <ToastContainer position="top-right" autoClose={5000}/>
            <Footer/>
        </>
    );
};

export default AddStaff;