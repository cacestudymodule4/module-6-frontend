import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {FaSave} from 'react-icons/fa';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
const AddCustomer = ({ showNavbarFooter = true,onClose  }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const getDefaultBirthday = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            identification: '',
            address: '',
            phone: '',
            email: '',
            company: '',
            gender: '',
            birthday: getDefaultBirthday()
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên khách hàng là bắt buộc'),
            birthday: Yup.date().required('Ngày sinh là bắt buộc')
                .test('age', 'Khách hàng phải trên 18 tuổi', (value) => {
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const month = today.getMonth() - birthDate.getMonth();
                    return age > 18 || (age === 18 && month >= 0);
                }),
            identification: Yup.string().required('Số chứng minh thư là bắt buộc')
                .matches(/^[0-9]{9,12}$/, "CMND phải chứa 9-12 chữ số"),
            address: Yup.string().required('Địa chỉ là bắt buộc'),
            phone: Yup.string().required('Số điện thoại là bắt buộc')
                .matches(/^[0-9]{10}$/, "Số điện thoại phải chứa 10 chữ số"),
            email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
            company: Yup.string().required('Tên công ty là bắt buộc'),
            gender: Yup.string().required('Giới tính là bắt buộc'),
        }),
        onSubmit: async (values) => {
            if (!token) navigate("/login");
            try {
                const response = await axios.post('http://localhost:8080/api/customers/add', values, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                });
                if (response.status === 200) {
                    toast.success('Khách hàng đã được thêm thành công!');
                    if(!showNavbarFooter) {
                        console.log("ok con dê")
                        onClose();
                    }else{navigate('/customer/list');}

                }
            } catch (error) {
                console.log(error)
                if (error.response) {
                    toast.error(error.response.data);
                }
            }
        },
    });
const handleBack =() =>{
    if (!showNavbarFooter) {
        onClose()
    }else{
        navigate('/customer/list');
    }
}
    return (
        <>
            {showNavbarFooter && <NavbarApp/>}
            <div className="container mt-5" style={{marginBottom: '50px'}}>
                <h2 className="text-center mb-5 bg-success text-white py-4">Thêm Mới Khách Hàng</h2>
                <form onSubmit={formik.handleSubmit}>
                    {/* Row 1: Name and Birthday */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Tên khách hàng<span
                                className="text-danger">(*)</span></label>
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
                            <label htmlFor="birthday" className="form-label">Ngày sinh<span
                                className="text-danger">(*)</span></label>
                            <input
                                type="date"
                                className="form-control"
                                id="birthday"
                                name="birthday"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.birthday || getDefaultBirthday()}
                            />
                            {formik.touched.birthday && formik.errors.birthday && (
                                <div className="text-danger">{formik.errors.birthday}</div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Identification and Address */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="identification" className="form-label">Số chứng minh thư<span
                                className="text-danger">(*)</span></label>
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
                            <label htmlFor="address" className="form-label">Địa chỉ<span
                                className="text-danger">(*)</span></label>
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
                            <label htmlFor="phone" className="form-label">Số điện thoại<span
                                className="text-danger">(*)</span></label>
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
                            <label htmlFor="email" className="form-label">Email<span
                                className="text-danger">(*)</span></label>
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

                    {/* Row 4: Company and Gender */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="company" className="form-label">Công ty<span
                                className="text-danger">(*)</span></label>
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
                            <label htmlFor="gender" className="form-label">Giới tính<span
                                className="text-danger">(*)</span></label>
                            <div className="form-group">
                                <div style={{gap: "7px", display: "flex", fontSize: "20px"}}>
                                    <input
                                        type="radio"
                                        id="male"
                                        name="gender"
                                        value="true"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.gender === "true"}
                                    />
                                    <label htmlFor="male" style={{marginRight: "20px"}}>Nam</label>
                                    <input
                                        type="radio"
                                        id="female"
                                        name="gender"
                                        value="false"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.gender === "false"}
                                    />
                                    <label htmlFor="female">Nữ</label>
                                </div>
                            </div>
                            {formik.touched.gender && formik.errors.gender && (
                                <div className="text-danger">{formik.errors.gender}</div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success">
                        <FaSave/> Lưu
                    </button>
                    <button type="button" className="btn btn-secondary ms-3" onClick={handleBack}>
                        Quay lại
                    </button>
                </form>
            </div>
            {showNavbarFooter && <Footer/>}
        </>
    );
};

export default AddCustomer;
