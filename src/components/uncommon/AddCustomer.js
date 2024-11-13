import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSave } from 'react-icons/fa';
import { NavbarApp } from "../common/Navbar";
import Footer from "../common/Footer";

const AddCustomer = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);  // State để lưu thông báo lỗi

    const formik = useFormik({
        initialValues: {
            name: '',
            birthday: '',
            identification: '',
            address: '',
            phone: '',
            email: '',
            company: '',
            website: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên khách hàng là bắt buộc'),
            birthday: Yup.date().required('Ngày sinh là bắt buộc'),
            identification: Yup.string().required('Số chứng minh thư là bắt buộc')
                .matches(/^[0-9]{9,12}$/, "CMND phải chứa 9-12 chữ số"),
            address: Yup.string().required('Địa chỉ là bắt buộc'),
            phone: Yup.string().required('Số điện thoại là bắt buộc')
                .matches(/^[0-9]{10}$/, "Số điện thoại phải chứa 10 chữ số"),
            email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
            company: Yup.string().required('Tên công ty là bắt buộc'),
            website: Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                // Gửi yêu cầu POST tới API backend để thêm khách hàng
                const response = await axios.post('http://localhost:8080/api/customers/add', values, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
                });

                // Kiểm tra xem yêu cầu có thành công không
                if (response.status === 200) {
                    toast.success('Khách hàng đã được thêm thành công!');
                    navigate('/customer/list');
                }
            } catch (error) {
                // Bắt lỗi và hiển thị thông báo lỗi từ backend
                if (error.response) {
                    // Nếu backend trả về lỗi chi tiết trong phần response.data
                    setError(error.response.data);  // Lưu thông báo lỗi từ backend
                } else {
                    // Lỗi kết nối hoặc lỗi khác
                    setError('Có lỗi kết nối với máy chủ. Vui lòng thử lại sau.');
                }
            }
        },
    });

    return (
        <>
            <NavbarApp />
            <div className="container mt-5" style={{ marginBottom: '50px' }}>
                <h2 className="text-center mb-5 bg-success text-white py-4">Thêm Mới Khách Hàng</h2>

                {/* Hiển thị thông báo lỗi nếu có */}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={formik.handleSubmit}>
                    {/* Row 1: Name and Birthday */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Tên khách hàng</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-danger">{formik.errors.name}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="birthday" className="form-label">Ngày sinh</label>
                            <input
                                type="date"
                                className="form-control"
                                id="birthday"
                                name="birthday"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.birthday}
                            />
                            {formik.touched.birthday && formik.errors.birthday && (
                                <div className="text-danger">{formik.errors.birthday}</div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Identification and Address */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="identification" className="form-label">Số chứng minh thư</label>
                            <input
                                type="text"
                                className="form-control"
                                id="identification"
                                name="identification"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.identification}
                            />
                            {formik.touched.identification && formik.errors.identification && (
                                <div className="text-danger">{formik.errors.identification}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="address" className="form-label">Địa chỉ</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.address}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <div className="text-danger">{formik.errors.address}</div>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Phone and Email */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label">Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-danger">{formik.errors.phone}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-danger">{formik.errors.email}</div>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Company and Website */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="company" className="form-label">Công ty</label>
                            <input
                                type="text"
                                className="form-control"
                                id="company"
                                name="company"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.company}
                            />
                            {formik.touched.company && formik.errors.company && (
                                <div className="text-danger">{formik.errors.company}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="website" className="form-label">Website</label>
                            <input
                                type="text"
                                className="form-control"
                                id="website"
                                name="website"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.website}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success">
                        <FaSave /> Lưu
                    </button>
                    <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate('/customer/list')}>
                        Quay lại
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default AddCustomer;
