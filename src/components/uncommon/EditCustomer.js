import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import moment from 'moment';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import {FaSave} from "react-icons/fa";

const customerSchema = Yup.object().shape({
    name: Yup.string().required("Tên khách hàng là bắt buộc"),
    birthday: Yup.date()
        .required("Ngày sinh là bắt buộc")
        .test(
            "is-18-years-old",
            "Khách hàng phải đủ 18 tuổi",
            (value) => moment().diff(moment(value), 'years') >= 18
        ),
    identification: Yup.string()
        .matches(/^[0-9]{9,12}$/, "CMND phải chứa 9-12 chữ số")
        .required("CMND là bắt buộc"),
    address: Yup.string().required("Địa chỉ là bắt buộc"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại phải chứa 10 chữ số")
        .required("Số điện thoại là bắt buộ c"),
    email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    company: Yup.string().required("Công ty là bắt buộc"),
});

function EditCustomer() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/edit/${id}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                });
                console.log("Customer data:", response.data);
                setCustomer(response.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin khách hàng:", error);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCustomer({...customer, [name]: value});
    };

    const handleSave = async () => {
        try {
            await customerSchema.validate(customer, {abortEarly: false});

            const response = await axios.put(
                `http://localhost:8080/api/customers/update/${id}`,
                customer,
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                }
            );

            if (response.status === 200) {
                toast.success("Cập nhật thành công");
                navigate('/customer/list');
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
                toast.error("Dữ liệu không hợp lệ.");
            } else if (error.response) {
                toast.error(error.response.data);
            }
        }
    };
    if (!customer) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5" style={{marginBottom: "50px"}}>
                <h2 className="text-center mb-5 bg-success text-white py-4">Chỉnh Sửa Khách Hàng</h2>
                <form>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">
                                Tên khách hàng<span className="text-danger"></span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                value={customer.name || ""}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="birthday" className="form-label">
                                Ngày sinh<span className="text-danger"></span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="birthday"
                                name="birthday"
                                onChange={handleChange}
                                value={customer.birthday ? moment(customer.birthday).format("YYYY-MM-DD") : ""}
                            />
                            {errors.birthday && <div className="text-danger">{errors.birthday}</div>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="identification" className="form-label">
                                Số chứng minh thư<span className="text-danger"></span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="identification"
                                name="identification"
                                onChange={handleChange}
                                value={customer.identification || ""}
                            />
                            {errors.identification && (
                                <div className="text-danger">{errors.identification}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="address" className="form-label">
                                Địa chỉ<span className="text-danger"></span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                onChange={handleChange}
                                value={customer.address || ""}
                            />
                            {errors.address && <div className="text-danger">{errors.address}</div>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label">
                                Số điện thoại<span className="text-danger"></span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                onChange={handleChange}
                                value={customer.phone || ""}
                            />
                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">
                                Email<span className="text-danger"></span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                value={customer.email || ""}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Công ty</label>
                            <input
                                type="text"
                                className="form-control"
                                name="company"
                                value={customer.company || ""}
                                onChange={handleChange}
                            />
                            {errors.company && <div className="text-danger">{errors.company}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Giới tính</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="genderMale"
                                        value="true"
                                        checked={customer.gender === true}
                                        onChange={(e) => handleChange({target: {name: "gender", value: true}})}
                                    />
                                    <label className="form-check-label" htmlFor="genderMale">
                                        Nam
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="genderFemale"
                                        value="false"
                                        checked={customer.gender === false} // So sánh Boolean
                                        onChange={(e) => handleChange({target: {name: "gender", value: false}})}
                                    />
                                    <label className="form-check-label" htmlFor="genderFemale">
                                        Nữ
                                    </label>
                                </div>
                            </div>
                            {errors.gender && <div className="text-danger">{errors.gender}</div>}
                        </div>
                    </div>
                    <button type="button" className="btn btn-success" onClick={handleSave}>
                        <FaSave/> Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-3"
                        onClick={() => navigate("/customer/list")}
                    >
                        Quay lại
                    </button>
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default EditCustomer;
