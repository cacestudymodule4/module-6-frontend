import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import React, {useState} from "react";
import * as Yup from "yup";
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import {useNavigate} from "react-router-dom";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";

const AddStaff = () => {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const initialValues = {
        name: '',
        gender: true,
        address: '',
        phone: '',
        email: '',
        salary: '',
        startDate: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Tên là bắt buộc")
            .min(2, "Tên phải có ít nhất 2 ký tự")
            .max(50, "Tên không được vượt quá 50 ký tự"),

        address: Yup.string()
            .required("Địa chỉ là bắt buộc")
            .min(5, "Địa chỉ phải có ít nhất 5 ký tự"),

        phone: Yup.string()
            .required("Số điện thoại là bắt buộc")
            .matches(/^[0-9]{10}$/, "Số điện thoại phải là 10 chữ số"),

        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email là bắt buộc")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Email phải có định dạng hợp lệ, ví dụ: example@domain.com"
            )
            .max(50, "Email không được vượt quá 50 ký tự"),

        salary: Yup.number()
            .required("Lương là bắt buộc")
            .positive("Lương phải là số dương")
            .min(1000, "Lương phải ít nhất là 1000 VNĐ")
            .max(100000000, "Lương không được vượt quá 100 triệu VNĐ"),

        startDate: Yup.date()
            .required("Ngày bắt đầu là bắt buộc")
            .max(new Date(), "Ngày bắt đầu không được ở tương lai"),
    });


    const addEmployee = async (values, {resetForm}) => {
        try {
            const response = await axios.post('http://localhost:8080/api/staff/add', values, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setStaffList([...staffList, response.data]);
            navigate('/staff/list')
            toast.success("Nhân viên mới đã được thêm thành công!");
            setIsAddModalOpen(false);
            resetForm();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thêm nhân viên");
        }
    };

    return (
        <>
            <NavbarApp></NavbarApp>
            <div>
                <div className="modal fade show" style={{display: 'block'}} aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm nhân viên mới</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsAddModalOpen(false)}></button>
                            </div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={addEmployee}
                            >
                                <FormikForm>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label>Tên</label>
                                            <Field type="text" name="name" className="form-control"/>
                                            <ErrorMessage name="name" component="div" className="text-danger"/>
                                        </div>
                                        <div className="mb-3">
                                            <label>Giới tính</label>
                                            <Field as="select" name="gender" className="form-select">
                                                <option value={true}>Nam</option>
                                                <option value={false}>Nữ</option>
                                            </Field>
                                        </div>
                                        <div className="mb-3">
                                            <label>Địa chỉ</label>
                                            <Field type="text" name="address" className="form-control"/>
                                            <ErrorMessage name="address" component="div" className="text-danger"/>
                                        </div>
                                        <div className="mb-3">
                                            <label>Số điện thoại</label>
                                            <Field type="text" name="phone" className="form-control"/>
                                            <ErrorMessage name="phone" component="div" className="text-danger"/>
                                        </div>
                                        <div className="mb-3">
                                            <label>Email</label>
                                            <Field type="email" name="email" className="form-control"/>
                                            <ErrorMessage name="email" component="div" className="text-danger"/>
                                        </div>
                                        <div className="mb-3">
                                            <label>Lương</label>
                                            <Field type="number" name="salary" className="form-control"/>
                                            <ErrorMessage name="salary" component="div" className="text-danger"/>
                                        </div>
                                        <div className="mb-3">
                                            <label>Ngày bắt đầu</label>
                                            <Field type="date" name="startDate" className="form-control"/>
                                            <ErrorMessage name="startDate" component="div" className="text-danger"/>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                onClick={() => navigate('/staff/list')}>
                                            Đóng
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Thêm
                                        </button>
                                    </div>
                                </FormikForm>
                            </Formik>
                        </div>
                    </div>
                </div>
                <ToastContainer position="top-right" autoClose={5000}/>
            </div>
            <Footer></Footer>
        </>
    );
}

export default AddStaff;
