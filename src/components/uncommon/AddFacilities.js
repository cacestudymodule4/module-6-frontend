import React, {useEffect, useState} from "react";
import {Form, Button, Row, Col, Modal, Table} from 'react-bootstrap';
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import axios from "axios";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";
import '../../assets/css/Contract.css';
import {FaRedo, FaSearch} from "react-icons/fa";

function AddFacilities() {
    const [ground, setGround] = useState([]);
    const [type, setType] = useState(null);
    const [showGroundModal, setShowGroundModal] = useState(false);
    const [groundSelected, setGroundSelected] = useState(null);
    const [groundSearch, setGroundSearch] = useState(null);
    const [floor, setFloor] = useState('');
    const [typeSelected, setTypeSelected] = useState(null);
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate("/login")

        async function getGround() {
            try {
                const response = await axios.get("http://localhost:8080/api/ground/list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setGround(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getFloor() {
            try {
                const response = await axios.get("http://localhost:8080/api/floor/get-list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setFloor(response.data);
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

        getFloor()
        getTypeFacilities();
        getGround();
    }, []);

    const handleSearchModal = (value) => {
        const listSearch = ground.filter((item) =>
            item.groundCode.toLowerCase().includes(value.searchGround.toLowerCase()) &&
            item.area.toString().includes(value.searchAcreage.toString()) &&
            item.floor.name.includes(value.positionFloor)
        );
        setGroundSearch(listSearch);
    }
    const handleFindType = (e, setFieldValue) => {
        const selectedType = type.find(t => t.name === e.target.value);
        if (selectedType) setFieldValue('facilitiesType', selectedType.name);
        setTypeSelected(selectedType);
    };
    const handleAddFacilities = async (value) => {
        try {
            const data = {
                ground: groundSelected,
                name: value.name,
                quantity: value.quantity,
                description: value.description,
                facilitiesType: typeSelected,
            }
            const res = await axios.post("http://localhost:8080/api/facilities/add", data, {
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
                    Thêm mới trang thiết bị</h2>
                <Formik
                    initialValues={{
                        facilitiesType: "",
                        name: "",
                        quantity: "",
                        description: "",
                        ground: groundSelected || '',

                    }}
                    onSubmit={handleAddFacilities}
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                >
                    {({values, setFieldValue}) => (
                        <FormikForm>
                            <Row style={{marginTop: "-2%"}}>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Loại thiết bị <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Field as="select" name="facilitiesType"
                                               className="custom-date-input custom-select "
                                               onChange={(e) => handleFindType(e, setFieldValue)}
                                        >
                                            <option value=""
                                                    className={"text-center"}
                                            > Chọn loại thiết bị
                                            </option>
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
                                            Nhập tên thiết bị <span className="text-danger">*</span>
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
                                            Nhập số lượng <span className="text-danger">*</span>
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
                                            Mã mặt bằng <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Field
                                            type="text"
                                            name={"ground"}
                                            placeholder="Chọn mã mặt bằng"
                                            className="form-control custom-date-input readonly-input "
                                            value={groundSelected ? groundSelected?.groundCode : ""}
                                            onClick={() => {
                                                setShowGroundModal(true);
                                                setGroundSearch(ground)
                                            }}
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
                                            Vị trí
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name={"location"}
                                            placeholder="vị trí mặt bằng"
                                            value={groundSelected ? groundSelected?.floor.name : ""}
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
                                Thêm thiết bị
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
                        <Formik initialValues={{
                            searchGround: '',
                            searchAcreage: '',
                            positionFloor: ''
                        }}
                                onSubmit={handleSearchModal}>
                            {({resetForm}) => (
                                <FormikForm className="mb-3 custom-search mr-5">
                                    <Form.Group className="mb-3" controlId="formSearch">
                                        <Form.Label className="small-label">Tìm theo tên</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder="Nhập tên mặt bằng"
                                            name="searchGround"
                                        />

                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formSearch">
                                        <Form.Label className="small-label">Tìm theo diện tích</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            placeholder="Nhập diện tích"
                                            name="searchAcreage"
                                        />

                                    </Form.Group>
                                    <Field as="select" name="positionFloor"
                                           className="custom-date-input custom-select "
                                           style={{width: '20%', marginTop: "10px"}}
                                    >
                                        <Form.Label className="small-label">Tìm theo diện tích</Form.Label>
                                        <option value=""
                                                className={"text-center"}
                                        > Chọn vị trí
                                        </option>
                                        {floor?.map((floor) => (
                                            <option key={floor.id} value={floor.name} className={"text-center"}>
                                                {floor.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <Button style={{marginRight: "5%"}} variant="secondary" type="submit"
                                            className={"search-contract-btn "}>
                                        <FaSearch></FaSearch>
                                    </Button>
                                    <Button variant="secondary" style={{borderRadius: "50%", marginTop: "7px"}}
                                            type={"button"}
                                            onClick={() => {
                                                setGroundSearch(ground);
                                                resetForm()
                                            }
                                            }> <FaRedo/></Button>
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                    <div className="modal-content-scroll">
                        {groundSearch?.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                            <Table striped bordered hover>
                                <thead className={"custom-table text-white text-center"}>
                                <tr>
                                    <th>Mã mặt bằng</th>
                                    <th>Diện tích</th>
                                    <th>Vị trí</th>
                                    <th>Giá thuê (tháng)</th>
                                    <th colSpan="3" className="text-center">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groundSearch?.map((ground, index) => (
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

export default AddFacilities