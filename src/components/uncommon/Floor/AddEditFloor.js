import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { NavbarApp } from "../../common/Navbar";
import Footer from "../../common/Footer";

export const AddEditFloor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [floor, setFloor] = useState(location.state?.floor || null);

    const validationSchema = Yup.object().shape({
        floorCode: Yup.string()
            .matches(/^MTL\d{3}$/, 'Mã tầng lầu phải theo định dạng MTLXXX, với XXX là các số')
            .required('Không được để trống'),
        name: Yup.string()
            .required('Không được để trống'),
        area: Yup.number()
            .min(1, 'Diện tích phải lớn hơn 1')
            .required('Không được để trống'),
        capacity: Yup.number()
            .min(1, 'Sức chứa phải lớn hơn 1')
            .required('Không được để trống'),
        typeOfFloor: Yup.string()
            .required('Không được để trống'),
    });
    const handleSave = async (values) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/floor/save`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            if (res.status === 200) {
                toast.success("Lưu thành công");
                navigate("/floor/list");
            } else toast.error("Đã có lỗi!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data);
        }
    }

    return (
        <>
            <NavbarApp />
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{ color: "white", height: "70px" }}>
                    Thêm mới hợp đồng</h2>
                <Formik
                    initialValues={{
                        id: floor?.id || null,
                        floorCode: floor?.floorCode || '',
                        name: floor?.name || '',
                        area: floor?.area || '',
                        capacity: floor?.capacity || '',
                        typeOfFloor: floor?.typeOfFloor || ''
                    }}
                    onSubmit={handleSave}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                >
                    <Form>
                        <div className="form-group mb-3">
                            <label className="form-label">Mã tầng lầu<span className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                name="floorCode"
                                className="form-control" />
                            <ErrorMessage
                                name="floorCode"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>


                        <div className="form-group mb-3">
                            <label className="form-label">Tên tầng<span className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                name="name"
                                className="form-control" />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Diện tích(m<sup>2</sup>)<span className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="number"
                                name="area"
                                className="form-control" />
                            <ErrorMessage
                                name="area"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Sức chứa<span className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="number"
                                name="capacity"
                                className="form-control" />
                            <ErrorMessage
                                name="capacity"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Loại tầng<span className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                name="typeOfFloor"
                                className="form-control" />
                            <ErrorMessage
                                name="typeOfFloor"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <Button variant="success" type="submit">
                            {floor ? "Chỉnh sửa" : "Thêm tầng"}
                        </Button>
                        <Button className={"ms-3"} variant="secondary" type="button"
                            onClick={() => navigate('/floor/list')}>
                            Quay lại
                        </Button>
                    </Form>
                </Formik>
            </div>
            <Footer />
        </>

    );
}
