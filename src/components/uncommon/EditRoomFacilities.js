import React, {useEffect, useState} from "react";
import {Form, Button, Row, Col, Modal, Table} from 'react-bootstrap';
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import axios from "axios";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";
import '../../assets/css/Contract.css';
import {FaSearch} from "react-icons/fa";

function EditRoomFacilities() {
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();
    const [ground, setGround] = useState([]);
    const [type, setType] = useState(null);
    const [groundSelected, setGroundSelected] = useState(null);
    const [typeSelected, setTypeSelected] = useState(null);
    const [showGroundModal, setShowGroundModal] = useState(false);
    const {id} = useParams();
    const [facilitiesEdit, setFacilitiesEdit] = useState({});
    useEffect(() => {
        if (!token) navigate("/login")

        async function getFacilities() {
            try {
                const response = await axios.get(`http://localhost:8080/api/facilities/find-facilities/${id}`,
                    {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})
                setFacilitiesEdit(response.data);
                setGroundSelected(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error)
            }
        }

        async function getGround() {
            try {
                const response = await axios.get("http://localhost:8080/api/contract/list-rent", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setGround(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getTypeFacilities() {
            try {
                const response = await axios.get("http://localhost:8080/api/facilities-type/list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setType(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        getTypeFacilities()
        getGround()
        getFacilities();
    }, [])
    const handleFindType = (e, setFieldValue) => {
        const selectedType = type.find(t => t.name === e.target.value); // Tìm đối tượng type dựa trên tên
        console.log(selectedType);
        if (selectedType) setFieldValue('facilitiesType', selectedType.name);
        setTypeSelected(selectedType); // Cập nhật state với đối tượng type
    };
    const handleSearchGround = async (value) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/ground/findGround?searchGround=${value.searchGround}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            setGround(res.data);
        } catch
            (err) {
            console.log(err);
        }
    }
    const handleSaveFacilities = async (value) => {
        console.log(typeSelected)
        try {
            const data = {
                id: value.id,
                ground: facilitiesEdit.ground || groundSelected,
                name: value.name,
                quantity: value.quantity,
                description: value.description,
                facilitiesType: facilitiesEdit.facilitiesType || typeSelected,
                damaged: value.damaged,
            }
            const res = await axios.put("http://localhost:8080/api/facilities/save", data, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            },);
            toast.success("Thêm mới thành công");
            navigate('/facilities/list')
        } catch (err) {
            toast.error("Thêm thất bại");
            console.log(err);
        }
    }
    const validationSchema = Yup.object().shape({
        description: Yup.string()
            .min(5, "Tối thiểu 5 ký tự")
            .max(300, "Tối đa 300 ký tự"),
        name: Yup.string()
            .min(2, "Tối thiểu 5 ký tự")
            .max(50, "Tối đa 300 ký tự")
            .required("Không được trống"),
        ground: Yup.string()
            .test('ground-check', 'Ground không được trống', function (value) {
                return groundSelected ? true : this.createError({message: 'Không được trống'});
            }),
        damaged: Yup.number()
            .min(0, "Không được âm")
            .max(Yup.ref('quantity'), 'Không được lớn hơn số lượng thiết bị'),
        quantity: Yup.number()
            .required('Không được trống')
            .min(1, 'Số lợng tối thiểu 1')  // Tối thiểu 3
            .max(200, 'Số lượng tối đa 200'),
    });
    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 " style={{marginBottom: "5%"}}>
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Chỉnh sửa trang thiết bị</h2>
                <Formik
                    enableReinitialize
                    initialValues={{
                        id: facilitiesEdit?.id || "",
                        facilitiesType: facilitiesEdit?.facilitiesType?.name || "",
                        name: facilitiesEdit?.name || "",
                        quantity: facilitiesEdit?.quantity || "",
                        description: facilitiesEdit?.description || "",
                        ground: facilitiesEdit?.ground?.name || "",
                        damaged: facilitiesEdit?.damaged || "",
                        location: facilitiesEdit?.ground?.area || "",
                    }}
                    onSubmit={handleSaveFacilities}
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                >
                    {({values, setFieldValue}) => (
                        <FormikForm>
                            <Row className={"mb-3"}>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Loại thiết bị <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Field as="select" name="facilitiesType"
                                               className="custom-date-input custom-select "
                                               onChange={(e) => handleFindType(e, setFieldValue)}
                                        >
                                            {type?.map((type) => (
                                                <option key={type.id} value={type.name} className={"text-center"}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="type"
                                            component="div"
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Tên thiết bị <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name="name"
                                            className="form-control custom-date-input readonly-input "
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Số lượng thiết bị <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            className="form-control custom-date-input readonly-input  "
                                            name="quantity"
                                        />
                                        <ErrorMessage
                                            name="quantity"
                                            component="div"
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Số lượng thiết bị hỏng
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            name={"damaged"}
                                            placeholder="Số lượng hỏng"
                                            className="form-control custom-date-input readonly-input "
                                        />
                                        <ErrorMessage
                                            name="damaged"
                                            component="div"
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Tên mặt bằng <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Field
                                            type="text"
                                            name={"ground"}
                                            placeholder="Chọn mặt bằng"
                                            className="form-control custom-date-input readonly-input "
                                            onClick={() => setShowGroundModal(true)}
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="ground"
                                            component="div"
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Vị trí mặt bằng
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name={"location"}
                                            placeholder="vị trí mặt bằng"
                                            className="form-control custom-date-input readonly-input input-info "
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Ghi chú
                                        </Form.Label>
                                        <Field
                                            as="textarea"
                                            rows={4}
                                            placeholder="Nhập nội dung hợp đồng"
                                            name={"description"}
                                            style={{width: '100%'}}
                                        />
                                        <ErrorMessage
                                            name="content"
                                            component="div"
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="success" type="submit">
                                Lưu
                            </Button>
                            <Button className={"ms-3"} variant="secondary" type="button"
                                    onClick={() => navigate('/facilities/list')}>
                                Quay lại
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </div>
            <Modal show={showGroundModal} className={"modal-contract-custom"}>
                <Modal.Header closeButton onClick={() => setShowGroundModal(false)}>
                    <Modal.Title>Xác Nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"search-fixed"}>
                        <Formik initialValues={{searchGround: ''}}
                                onSubmit={handleSearchGround}>
                            {() => (
                                <FormikForm className="mb-3 custom-search ">
                                    <Form.Group className="mb-3" controlId="formSearch">
                                        <Form.Label className="small-label">Tìm theo tên mặt bằng</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder="Nhập tên mặt bằng"
                                            name="searchGround"
                                        />
                                    </Form.Group>
                                    <Button style={{marginRight: "68%"}} variant="secondary" type="submit"
                                            className={"search-contract-btn "}>
                                        <FaSearch></FaSearch>
                                    </Button>
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                    <div className="modal-content-scroll">
                        {ground.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                            <Table striped bordered hover>
                                <thead className={"custom-table text-white text-center"}>
                                <tr>
                                    <th>Tên mặt bằng</th>
                                    <th>Diện tích</th>
                                    <th>Vị trí</th>
                                    <th>Giá thuê (tháng)</th>
                                    <th colSpan="3" className="text-center">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ground.map((ground, index) => (
                                    <tr key={ground.id}>
                                        <td className="text-center">{ground.groundCode}</td>
                                        <td className="text-center">{ground.area} m²</td>
                                        <td className="text-center">{ground.floor.name}</td>
                                        <td className="text-center">{ground.price} VNĐ</td>
                                        <td className="text-center">
                                            <Button variant="info" type="button"
                                                    onClick={() => {
                                                        setShowGroundModal(false)
                                                        setGroundSelected(ground)
                                                    }}
                                            >
                                                Chọn
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGroundModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer/>
        </>
    )
}

export default EditRoomFacilities;
