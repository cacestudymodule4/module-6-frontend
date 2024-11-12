import React, {useState} from 'react';
import axios from 'axios';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import '../../assets/css/AddCustomer.css';
import { useNavigate } from 'react-router-dom';

function AddCustomer() {
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const formik = useFormik({
        initialValues: {
            name: '',
            birthday: '',
            identification: '',
            address: '',
            phone: '',
            email: '',
            company: '',
            website: ''
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
            website: Yup.string()
        }),
        onSubmit: async (values, {resetForm}) => {
            try {
                const response = await axios.post('http://localhost:8080/api/customers', values, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                });
                if (response.status === 200) {
                    toast.success('Khách hàng đã được thêm thành công!');
                    setError(null);
                    resetForm();
                }
            } catch (error) {
                if (error.response) {
                    const errorMessage = error.response.data;
                    console.error('Có lỗi khi thêm khách hàng:', errorMessage);
                    if (error.response.status === 400) {
                        if (errorMessage.includes('Duplicate Email')) {
                            setError('Email đã tồn tại. Vui lòng chọn email khác.');
                        } else if (errorMessage.includes('Invalid Data')) {
                            setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                        } else if (errorMessage.includes('Duplicate Identification')) {
                            setError('CMND đã tồn tại');
                        } else {
                            setError('Có lỗi khi thêm khách hàng. Vui lòng thử lại.');
                        }
                    } else {
                        setError('Có lỗi khi thêm khách hàng. Mã lỗi: ' + error.response.status);
                    }
                }
                setSuccessMessage(null);
            }
        }
    });
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/customer/list');
    };
    return (
        <div className="add-customer-background">
            <div className="add-customer-page">
                <h2>Thêm mới khách hàng</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={formik.handleSubmit}>
                    <label>Tên khách hàng:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p className="error-message">{formik.errors.name}</p>
                    ) : null}
                    <label>Ngày sinh:</label>
                    <input
                        type="date"
                        name="birthday"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.birthday}
                    />
                    {formik.touched.birthday && formik.errors.birthday ? (
                        <p className="error-message">{formik.errors.birthday}</p>
                    ) : null}
                    <label>Số chứng minh thư:</label>
                    <input
                        type="text"
                        name="identification"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.identification}
                    />
                    {formik.touched.identification && formik.errors.identification ? (
                        <p className="error-message">{formik.errors.identification}</p>
                    ) : null}
                    <label>Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <p className="error-message">{formik.errors.address}</p>
                    ) : null}
                    <label>Số điện thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <p className="error-message">{formik.errors.phone}</p>
                    ) : null}
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="error-message">{formik.errors.email}</p>
                    ) : null}
                    <label>Website:</label>
                    <input
                        type="text"
                        name="website"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.website}
                    />
                    {formik.touched.website && formik.errors.website ? (
                        <p className="error-message">{formik.errors.website}</p>
                    ) : null}
                    <label>Tên công ty:</label>
                    <input
                        type="text"
                        name="company"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.company}
                    />
                    {formik.touched.company && formik.errors.company ? (
                        <p className="error-message">{formik.errors.company}</p>
                    ) : null}
                    <button type="submit">Lưu</button>
                    <button type="submit" onClick={handleRedirect}>Quay lại</button>
                </form>
            </div>
        </div>
    );
}

export default AddCustomer;
