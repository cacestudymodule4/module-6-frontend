import React, {useEffect, useState} from "react";
import {Button} from 'react-bootstrap';
import {Formik, Field, Form, ErrorMessage} from "formik";
import axios from "axios";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {useLocation, useNavigate} from 'react-router-dom';
import {NavbarApp} from "../../common/Navbar";
import Footer from "../../common/Footer";

export const AddEditGround = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ground, setGround] = useState(location.state?.ground || null);
    const [floors, setFloors] = useState([]);

    useEffect(() => {
        async function getFloors() {
            try {
                const response = await axios.get("http://localhost:8080/api/floor/get-all"
                    , {
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                    });
                setFloors(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        getFloors();
    }, []);

    const validationSchema = Yup.object().shape({
        groundCode: Yup.string()
            .matches(/^MB\d{3}$/, 'Mã tầng lầu phải theo định dạng MBXXX, với XXX là các số')
            .required('Không được để trống'),
        groundCategory: Yup.string()
            .required('Không được để trống'),
        area: Yup.number()
            .min(1, 'Diện tích phải lớn hơn 1')
            .required('Không được để trống'),
        price: Yup.number()
            .required('Không được để trống'),
    });

    const handleSave = async (values) => {
        try {
            const floor = floors.find(floor => floor.id == values.floorId);
            const data = {
                ...values,
                floor: floor
            }

            const res = await axios.post(`http://localhost:8080/api/ground/save`, data, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });

            if (res.status === 200) {
                toast.success("Lưu thành công");
                navigate("/ground/list");
            } else toast.error("Đã có lỗi!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data);
        }
    }

    return (
        <>
            <NavbarApp/>
            <div className="container my-5 p-4">
                <h2 className="text-center text-white mb-5 bg-success p-3 rounded"
                    style={{fontSize: '2.15rem'}}>
                    {ground ? "Chỉnh sửa mặt bằng" : "Thêm mới mặt bằng"}
                </h2>
                <Formik
                    initialValues={{
                        id: ground?.id || null,
                        groundCode: ground?.groundCode || '',
                        groundCategory: ground?.groundCategory || '',
                        status: false,
                        area: ground?.area || '',
                        price: ground?.price || '',
                        floorId: ground?.floor?.id || ''
                    }}
                    onSubmit={handleSave}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                >
                    <Form>
                        <div className="mb-2">
                            <label htmlFor="floorId" className="form-label" style={{fontSize: '1.2rem'}}>Chọn
                                tầng:</label>
                            <Field
                                as="select"
                                id="floorId"
                                name="floorId"
                                className="form-select form-select-lg">
                                {floors.map(floor => (
                                    <option key={floor.id} value={floor.id}>
                                        {floor.name}
                                    </option>
                                ))}
                            </Field>
                        </div>

                        <div className="mb-2">
                            <label className="form-label" style={{fontSize: '1.2rem'}}>Mã mặt bằng<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                name="groundCode"
                                className="form-control form-control-lg"/>
                            <ErrorMessage
                                name="groundCode"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>


                        <div className="mb-2">
                            <label className="form-label" style={{fontSize: '1.2rem'}}>Loại mặt bằng<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                name="groundCategory"
                                className="form-control form-control-lg"/>
                            <ErrorMessage
                                name="groundCategory"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label" style={{fontSize: '1.2rem'}}>Diện tích(m<sup>2</sup>)<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="number"
                                name="area"
                                className="form-control form-control-lg"/>
                            <ErrorMessage
                                name="area"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label" style={{fontSize: '1.2rem'}}>Giá tiền<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="number"
                                name="price"
                                className="form-control form-control-lg"/>
                            <ErrorMessage
                                name="price"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button className="btn-lg me-2" variant="secondary" type="button"
                                    onClick={() => navigate('/ground/list')}>
                                <i className="bi bi-arrow-left-circle me-2"></i>
                                Quay lại
                            </Button>
                            <Button variant="success" type="submit" className="btn-lg">
                                {ground ? (
                                    <>
                                        Chỉnh sửa
                                        <i className="bi bi-pencil" style={{ marginLeft: '8px' }}></i>
                                    </>
                                ) : (
                                    <>
                                        Thêm mới
                                        <i className="bi bi-plus-circle" style={{ marginLeft: '8px' }}></i>
                                    </>
                                )}
                            </Button>
                        </div>

                    </Form>
                </Formik>
            </div>
            <Footer/>
        </>

    );
}
