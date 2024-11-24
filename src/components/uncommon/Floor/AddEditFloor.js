import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavbarApp } from "../../common/Navbar";
import Footer from "../../common/Footer";

export const AddEditFloor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [floor, setFloor] = useState(location.state?.floor || null);
    const [floorCategories, setFloorCategories] = useState([]);
    const [floorCodeRollBack, setFloorCodeRollBack] = useState({});
    const [showRollBackModal, setShowRollBackModal] = useState(false);

    useEffect(() => {
        const getFloorCategories = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/floor-category/list`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    }
                );
                setFloorCategories(res.data);

            } catch (error) {
                console.log(error);
            }
        };

        getFloorCategories();
    }, [])

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
            .required('Không được để trống')
    });

    const handleSave = async (values) => {
        try {
            const floorCategory = floorCategories.find(e => e.id == values.floorCategoryId)
            const data = {
                ...values,
                floorCategory
            }
            const res = await axios.post(`http://localhost:8080/api/floor/save`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            if (res.status === 200) {
                toast.success("Lưu thành công");
                navigate("/floor/list");
            } else toast.error("Đã có lỗi!");
        } catch (error) {
            toast.error(error.response.data);
            if (error.response.data == "Mã tầng lầu đã bị xoá trước đó") {
                setShowRollBackModal(true);
                setFloorCodeRollBack(values.floorCode);
            }
        }
    }

    const handleConfirmRollBack = async () => {
        const data = {
            floorCode: floorCodeRollBack
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/floor/roll-back`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                params: data
            });

            if (res.status === 200) {
                navigate("/floor/list");
                toast.success("Khôi phục thành công");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <NavbarApp />
            <div className="container my-5 rounded p-4">
                <h3 className="text-center text-white mb-5 py-3 bg-success rounded"
                    style={{ fontSize: '2.15rem' }}>
                    {floor ? "Chỉnh sửa tầng" : "Thêm mới tầng"}
                </h3>
                <Formik
                    initialValues={{
                        id: floor?.id || null,
                        floorCode: floor?.floorCode || '',
                        name: floor?.name || '',
                        area: floor?.area || '',
                        capacity: floor?.capacity || '',
                        floorCategoryId: floor?.floorCategory?.id || floorCategories[0]?.id
                    }}
                    onSubmit={handleSave}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                >
                    <Form>
                        <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '1.2rem' }}>Mã tầng lầu<span
                                className="text-danger">*</span>:</label>
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

                        <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '1.2rem' }}>Tên tầng<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                name="name"
                                className="form-control " />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '1.2rem' }}>Diện tích(m<sup>2</sup>)<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as={Form.Control}
                                type="number"
                                name="area"
                                className="form-control " />
                            <ErrorMessage
                                name="area"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '1.2rem' }}>Sức chứa<span
                                className="text-danger">*</span>:</label>
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

                        <div className="mb-2">
                            <label className="form-label" style={{ fontSize: '1.2rem' }}>Loại tầng<span
                                className="text-danger">*</span>:</label>
                            <Field
                                as="select"
                                id="floorCategoryId"
                                name="floorCategoryId"
                                className="form-select form-control-lg">
                                {floorCategories.map(element => (
                                    <option key={element.id} value={element.id}>
                                        {element.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="floorCategoryId"
                                component="div"
                                className="error-message text-danger"
                            />
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button className="btn-lg me-2" variant="secondary" type="button"
                                onClick={() => navigate('/floor/list')}>
                                <i className="bi bi-arrow-left-circle me-2"></i>
                                Quay lại
                            </Button>
                            <Button variant="success" type="submit" className="btn-lg">
                                {floor ? (
                                    <>
                                        Chỉnh sửa
                                        <i className="bi bi-pencil" style={{ marginLeft: '8px' }}></i>
                                    </>
                                ) : (
                                    <>
                                        Thêm tầng
                                        <i className="bi bi-plus-circle" style={{ marginLeft: '8px' }}></i>
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </div>
            <Footer />

            <Modal show={showRollBackModal} centered onHide={() => setShowRollBackModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác Nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Mã tầng lầu <span className="text-danger"> {floorCodeRollBack} </span> đã tồn tài nhưng bị xoá trước đó. Bạn có muốn khôi phục không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRollBackModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmRollBack}>
                        Khôi phục
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}
