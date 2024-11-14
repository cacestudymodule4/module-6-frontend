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
import {FaSearch} from "react-icons/fa";

function AddContract() {
    const navigate = useNavigate();
    const [ground, setGround] = useState([]);
    const [staff, setStaff] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(null);
    const [staffSelected, setStaffSelected] = useState(null);
    const [groundSelected, setGroundSelected] = useState(null);
    const [priceGround, setPriceGround] = useState('');
    const [startDay, setStartDay] = useState('');
    const [endDay, setEndDay] = useState('');
    const [term, setTerm] = useState('');
    const [showCusModal, setShowCusModal] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showGroundModal, setShowGroundModal] = useState(false);
    const [listContract, setListContract] = useState([]);
    const [totalPrice, setTotalPrice] = useState(null);
    useEffect(() => {
        async function getStaff() {
            try {
                const response = await axios.get("http://localhost:8080/api/staff/list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setStaff(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getContract() {
            try {
                const response = await axios.get("http://localhost:8080/api/contract/list"
                    , {
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                    });
                setListContract(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        async function getCustomer() {
            try {
                const response = await axios.get("http://localhost:8080/api/customers/list-add", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setCustomer(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getGround() {
            try {
                const response = await axios.get("http://localhost:8080/api/ground/list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setGround(response.data);
                console.log("okk")
            } catch (error) {
                console.log(error);
            }
        }

        getContract();
        getCustomer();
        getGround();
        getStaff();
    }, []);
    const handleAddContract = async (value, {resetForm}) => {
        console.log("adding contract");
        try {
            const data = {
                ground: groundSelected,
                staff: staffSelected,
                customer: customerSelected,
                totalPrice: totalPrice,
                term: value.term,
                startDate: startDay,
                endDate: endDay,
                price: priceGround,
                deposit: value.deposit,
                description: value.content,
            }
            const res = await axios.post(`http://localhost:8080/api/contract/add`, data, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            if (res.status === 200) {
                toast.success("Thêm mới thành công");
                navigate('/contract/list')
            }
        } catch (error) {
            toast.error("Thêm thất bại");
            console.log(error);
        }
    }
    const calculateEndDate = (startDate, months) => {
        if (!startDate || !months) return '';
        const start = new Date(startDate);
        start.setMonth(start.getMonth() + parseInt(months));
        return start.toISOString().split('T')[0];  // Định dạng lại thành "YYYY-MM-DD"
    };

    const handleTermChange = (event) => {
        const termValue = event.target.value;
        setTerm(termValue);
        const price = priceGround * termValue;
        setTotalPrice(price)
        const calculatedEndDate = calculateEndDate(startDay, termValue);
        setEndDay(calculatedEndDate);
    };
    const handleStartDayChange = (event) => {
        const startDate = event.target.value;
        setStartDay(startDate);
        const calculatedEndDate = calculateEndDate(startDate, term);
        setEndDay(calculatedEndDate);
    };

    const initialValues = {
        totalPrice: totalPrice * 0.1,
        term: term,
        customer: customerSelected ? customerSelected.name : "",
        staff: staffSelected ? staffSelected.name : "",
        ground: groundSelected ? groundSelected.name : "",
        startDay: startDay,
        endDay: '',
        deposit: '',
        content: ''
    };
    const validationSchema = Yup.object().shape({
        content: Yup.string()
            .min(5, "Tối thiểu 5 ký tự")
            .max(300, "Tối đa 300 ký tự")
            .required('Không được trống'),
        deposit: Yup.number()
            .min(totalPrice, "Tiền cọc phải lớn hơn hoặc bằng 10% tổng tiền")
            .max(totalPrice, "Tối đa số bằng tổng số tiền")
            .required('Không được trống'),
        staff: Yup.string()
            .required("Không được trống"),
        ground: Yup.string()
            .required("Không được trống"),
        customer: Yup.string()
            .required("không được trống"),
        term: Yup.number()
            .required('Không được trống')
            .min(3, 'Kỳ hạng tối thiểu 3 tháng')  // Tối thiểu 3
            .max(60, 'Kỳ hạng tối đa 60 tháng'),
        startDay: Yup.date()
            .required('Ngày bắt đầu là bắt buộc')
            .min(new Date(), 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại'),
    });
    // =================Tìm trong modal===============//
    const handleSearchCus = async (value) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/customers/findCus?searchCus=${value.searchCus}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            setCustomer(res.data);
        } catch
            (err) {
            console.log(err);
        }
    }
    const handleSearchStaff = async (value) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/staff/findStaff?searchStaff=${value.searchStaff}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            setStaff(res.data);
        } catch
            (err) {
            console.log(err);
        }
    }
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

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Thêm mới hợp đồng</h2>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleAddContract}
                    enableReinitialize
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                >
                    {({values, setFieldValue}) => (
                        <FormikForm>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <Button variant={"success"} style={{marginRight: "30px"}} onClick={() => setShowCusModal(true)}>
                                                Chon khách hàng
                                            </Button> </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name={"customer"}
                                            className="form-control custom-date-input readonly-input "
                                            value={customerSelected ? customerSelected.name : ""}
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="customer"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Số điện thoại
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={customerSelected ? customerSelected.phone : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Email
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            name={"emailCus"}
                                            value={customerSelected ? customerSelected.email : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Địa chỉ
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            name={"adrCus"}
                                            value={customerSelected ? customerSelected.address : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                            </Row>
                            {/*  --------------chọn nhân viên----------------------*/}
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <Button variant={"success"} style={{marginRight: "30px"}}
                                                    onClick={() => setShowStaffModal(true)}>
                                                Chon nhân viên
                                            </Button> </Form.Label>
                                        <Field
                                            type="text"
                                            name={"staff"}
                                            className="form-control custom-date-input readonly-input "
                                            value={staffSelected ? staffSelected.name : ""}
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="staff"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Số điện thoại
                                        </Form.Label>
                                        <Field
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={staffSelected ? staffSelected.phone : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Email
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={staffSelected ? staffSelected.email : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Địa chỉ
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={staffSelected ? staffSelected.address : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                            </Row>
                            {/*========================== chọn mat bằng ============================*/}
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <Button variant={"success"} style={{marginRight: "30px"}}
                                                    onClick={() => setShowGroundModal(true)}>
                                                Chon mặt bằng
                                            </Button> </Form.Label>
                                        <Field
                                            type="text"
                                            name={"ground"}
                                            className="form-control custom-date-input readonly-input "
                                            value={groundSelected ? groundSelected.name : ""}
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="ground"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Diện tích </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={groundSelected ? groundSelected.area + " m²" : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Vị trí
                                        </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={groundSelected ? groundSelected.floor.name : ""}
                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={"add-label"}>
                                            Giá thuê theo tháng </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            value={groundSelected ? groundSelected.price + " VNĐ" : ""}

                                            readOnly
                                        />

                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nhập kỳ hạng (tháng)</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            name="term"
                                            className="custom-date-input"
                                            value={term}
                                            onChange={(e) => {
                                                handleTermChange(e);
                                            }}
                                        />
                                        <ErrorMessage
                                            name="term"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Chọn ngày bắt đầu thuê</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="date"
                                            name="startDay"
                                            value={startDay}
                                            className={"custom-date-input"}
                                            onChange={(e) => {
                                                handleStartDayChange(e);
                                            }}
                                        />
                                        <ErrorMessage
                                            name="startDay"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày kết thúc</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="date"
                                            name="endDay"
                                            value={endDay}
                                            className={"custom-date-input readonly-input"}
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="endDay"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tổng tiền</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className={"custom-date-input"}
                                            value={totalPrice + " VNĐ"}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tiền cọc (VNĐ)</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            className={"custom-date-input"}
                                            name="deposit"
                                        />
                                        <ErrorMessage
                                            name="deposit"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nội dung</Form.Label>
                                        <Field
                                            as="textarea"
                                            rows={4}
                                            placeholder="Nhập nội dung hợp đồng"
                                            name="content"
                                            style={{width: '100%'}}
                                        />
                                        <ErrorMessage
                                            name="content"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="success" type="submit">
                                Thêm hợp đồng
                            </Button>
                            <Button className={"ms-3"} variant="secondary" type="button"
                                    onClick={() => navigate('/contract/list')}>
                                Quay lại
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </div>
            {/*===========modal nhân viên====================*/}
            <Modal show={showStaffModal} className={"modal-contract-custom"}>
                <Modal.Header closeButton onClick={() => setShowStaffModal(false)}>
                    <Modal.Title>Xác Nhận</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className={"search-fixed"}>
                        <Formik initialValues={{searchStaff: ''}}
                                onSubmit={handleSearchStaff}>
                            {() => (
                                <FormikForm className="mb-3 custom-search ">
                                    <Form.Group className="mb-3" controlId="formSearch">
                                        <Form.Label className="small-label">Tìm theo tên nhân viên</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder="Nhập tên nhân viên"
                                            name="searchStaff"
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
                        {staff.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                            <Table striped bordered hover>
                                <thead className={"custom-table text-white text-center"}>
                                <tr>
                                    <th>Tên nhân viên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th colSpan="3" className="text-center">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {staff.map((staff, index) => (
                                    <tr key={staff.id}>
                                        <td className="text-center">{staff.name}</td>
                                        <td className="text-center">{staff.phone}</td>
                                        <td className="text-center">{staff.email}</td>
                                        <td className="text-center">
                                            <Button variant="info" type="button"
                                                    onClick={() => {
                                                        setStaffSelected(staff);
                                                        setShowStaffModal(false);
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
                    <Button variant="secondary" onClick={() => setShowStaffModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*============modal khách hàng=================*/}
            <Modal show={showCusModal} className={"modal-contract-custom"}>
                <Modal.Header closeButton onClick={() => setShowCusModal(false)}>
                    <Modal.Title>Xác Nhận</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className={"search-fixed"}>
                        <Formik initialValues={{searchCus: ''}}
                                onSubmit={(value) => handleSearchCus(value)}>
                            {() => (
                                <FormikForm className="mb-3 custom-search ">
                                    <Form.Group className="mb-3" controlId="formSearch">
                                        <Form.Label className="small-label">Tìm theo tên khách hàng</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder="Nhập tên khách hàng"
                                            name="searchCus"
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
                        {customer.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                            <Table striped bordered hover>
                                <thead className={"custom-table text-white text-center"}>
                                <tr>
                                    <th>Tên khách hàng</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th colSpan="3" className="text-center">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customer.map((customer, index) => (
                                    <tr key={customer.id}>
                                        <td className="text-center">{customer.name}</td>
                                        <td className="text-center">{customer.phone}</td>
                                        <td className="text-center">{customer.email}</td>
                                        <td className="text-center">
                                            <Button variant="info" type="button"
                                                    onClick={() => {
                                                        setCustomerSelected(customer);
                                                        setShowCusModal(false);
                                                        console.log(customerSelected)
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
                    <Button variant="secondary" onClick={() => setShowCusModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*===========modal mặt bằng====================*/}
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
                                        <td className="text-center">{ground.name}</td>
                                        <td className="text-center">{ground.area} m²</td>
                                        <td className="text-center">{ground.floor.name}</td>
                                        <td className="text-center">{ground.price} VNĐ</td>
                                        <td className="text-center">
                                            <Button variant="info" type="button"
                                                    onClick={() => {
                                                        setPriceGround(ground.price);
                                                        setGroundSelected(ground);
                                                        setTotalPrice(term * ground.price);
                                                        setShowGroundModal(false);
                                                        console.log(customerSelected)
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
    );
}

export default AddContract;
