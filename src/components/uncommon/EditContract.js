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

function AddContract() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [contractEdit, setContractEdit] = useState({});
    const [staff, setStaff] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(null);
    const [staffSelected, setStaffSelected] = useState(null);
    const [startDay, setStartDay] = useState('');
    const [endDay, setEndDay] = useState('');
    const [term, setTerm] = useState('');
    const [showCusModal, setShowCusModal] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [checkDay, setCheckDay] = useState('1000-01-01');
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (!token) navigate("/login")
        async function getStaff() {
            try {
                const response = await axios.get("http://localhost:8080/api/staff/list-add", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setStaff(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getContract() {
            try {
                const response = await axios.get(`http://localhost:8080/api/contract/findContract/${id}`
                    , {
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                    });
                setContractEdit(response.data);
                setStartDay(response.data.startDate);
                setTerm(response.data.term);

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


        getContract();
        getCustomer();
        getStaff();
    }, []);
    const handleSaveContract = async (value) => {
        try {
            const data = {
                id: contractEdit.id,
                staff: value.staffEdit,
                customer: value.customerEdit,
                term: value.term,
                startDate: value.startDay,
                endDate: value.endDay,
                description: value.content,
            }
            console.log(value.startDay);
            console.log(value.endDay)
            console.log(customerSelected)
            const res = await axios.put(`http://localhost:8080/api/contract/save`,  data,{
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            if (res.status === 200) {
                toast.success("Chỉnh sửa thành công");
                navigate('/contract/list')
            }
        } catch (error) {
            toast.error("Chỉnh sửa thất bại");
            console.log(error);
        }
    }
    const calculateEndDate = (startDate, months) => {
        if (!startDate || !months) return '';
        const start = new Date(startDate);
        start.setMonth(start.getMonth() + parseInt(months));
        return start.toISOString().split('T')[0];  // Định dạng lại thành "YYYY-MM-DD"
    };

    const handleTermChange = (event, setFieldValue) => {
        const termValue = event.target.value;
        setTerm(termValue);
        setFieldValue("term", termValue);
        if (startDay) {
            const calculatedEndDate = calculateEndDate(startDay, termValue);
            setEndDay(calculatedEndDate);
        }
    };
    const checkGround = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/contract/checkDay?day=${contractEdit.ground.name}`,
                {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},})
            const checkDay = res.data;
            setCheckDay(checkDay)
            console.log(checkDay)

        } catch (err) {
            console.log(err);
        }
    }

    const handleStartDayChange = (event) => {
        const startDate = event.target.value;
        setStartDay(startDate);
        if (term) {
            const calculatedEndDate = calculateEndDate(startDate, term);  // Tính toán endDate
            setEndDay(calculatedEndDate);  // Cập nhật endDay
        }
      checkGround();
    };
    const initialValues = {
        customerEdit: customerSelected || contractEdit.customer,
        staffEdit: staffSelected || contractEdit.staff,
        term:term || contractEdit?.term,
        customer: customerSelected?.name || contractEdit?.customer?.name,
        staff: staffSelected?.name || contractEdit?.staff?.name,
        startDay: startDay || contractEdit?.startDate,
        endDay: endDay || contractEdit?.endDate,
        content: contractEdit?.description,
    };
    const checkDayDate = new Date(checkDay);
    const validationSchema = Yup.object().shape({
        content: Yup.string()
            .min(5, "Tối thiểu 5 ký tự")
            .max(300, "Tối đa 300 ký tự")
            .required('Không được trống'),
        staff: Yup.string()
            .required("Không được trống"),
        customer: Yup.string()
            .required("không được trống"),
        term: Yup.number()
            .required('Không được trống')
            .min(3, 'Kỳ hạng tối thiểu 3 tháng')  // Tối thiểu 3
            .max(60, 'Kỳ hạng tối đa 60 tháng'),
        startDay: Yup.date()
            .required('Ngày bắt đầu là bắt buộc')
            .test(
                'is-valid-start-day',
                function (value) {
                    const startDate = value ? new Date(value).setHours(0, 0, 0, 0) : null;
                    const today = new Date().setHours(0, 0, 0, 0);
                    const checkDay = new Date(checkDayDate).setHours(0, 0, 0, 0);
                    if (!startDate) {
                        return this.createError({message: 'Ngày bắt đầu là bắt buộc'});
                    }
                    if (checkDay === today) {
                        if (startDate < today) {
                            return this.createError({message: 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại'});
                        }
                    } else if (checkDay > today) {
                        if (startDate < checkDay) {
                            return this.createError({message: `Ngày bắt đầu phải sau ngày ${checkDayDate.toLocaleDateString()}`});
                        }
                    }

                    return true;
                }
            )

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

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Chỉnh sửa hợp đồng</h2>

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        handleSaveContract(values)
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                >
                    {({setFieldValue, values}) => (
                        <FormikForm>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <Button variant={"success"} style={{marginRight: "30px"}}
                                                    onClick={() => setShowCusModal(true)}>
                                                Chon khách hàng
                                            </Button> </Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name={"customer"}
                                            className="form-control custom-date-input readonly-input "
                                            value={
                                                customerSelected
                                                    ? customerSelected.name
                                                    : contractEdit && contractEdit.customer
                                                        ? contractEdit.customer.name
                                                        : ""
                                            }
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="customer"
                                            component="div"
                                            className="error-message text-danger message-error"
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
                                            className="form-control custom-date-input readonly-input input-info "
                                            value={
                                                customerSelected
                                                    ? customerSelected.phone
                                                    : contractEdit && contractEdit.customer
                                                        ? contractEdit.customer.phone
                                                        : ""
                                            }
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
                                            className="form-control custom-date-input readonly-input input-info "
                                            name={"emailCus"}
                                            value={
                                                customerSelected
                                                    ? customerSelected.email
                                                    : contractEdit && contractEdit.customer
                                                        ? contractEdit.customer.email
                                                        : ""
                                            }
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
                                            className="form-control custom-date-input readonly-input input-info "
                                            name={"adrCus"}
                                            value={
                                                customerSelected
                                                    ? customerSelected.address
                                                    : contractEdit && contractEdit.customer
                                                        ? contractEdit.customer.address
                                                        : ""
                                            }
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
                                            value={
                                                staffSelected
                                                    ? staffSelected.name
                                                    : contractEdit && contractEdit.staff
                                                        ? contractEdit.staff.name
                                                        : ""
                                            }
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="staff"
                                            component="div"
                                            className="error-message text-danger message-error"
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
                                            className="form-control custom-date-input readonly-input input-info "
                                            value={
                                                staffSelected
                                                    ? staffSelected.phone
                                                    : contractEdit && contractEdit.staff
                                                        ? contractEdit.staff.phone
                                                        : ""
                                            }
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
                                            type="text"
                                            className="form-control custom-date-input readonly-input input-info "
                                            value={
                                                staffSelected
                                                    ? staffSelected.email
                                                    : contractEdit && contractEdit.staff
                                                        ? contractEdit.staff.email
                                                        : ""
                                            }
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
                                            className="form-control custom-date-input readonly-input input-info "
                                            value={
                                                staffSelected
                                                    ? staffSelected.address
                                                    : contractEdit && contractEdit.staff
                                                        ? contractEdit.staff.address
                                                        : ""
                                            }
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
                                            value={values.term}
                                            onChange={(e) => handleTermChange(e, setFieldValue)}
                                        />
                                        <ErrorMessage
                                            name="term"
                                            component="div"
                                            className="error-message text-danger message-error"
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
                                            className={"custom-date-input"}
                                            value={startDay || contractEdit?.startDate || ""}
                                            onChange={handleStartDayChange}
                                        />
                                        <ErrorMessage
                                            name="startDay"
                                            component="div"
                                            className="error-message text-danger message-error"
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
                                            className="form-control custom-date-input readonly-input input-info "
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="endDay"
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
                                            className="error-message text-danger message-error"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="success" type="submit">
                                Lưu
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
            <Footer/>
        </>
    );
}

export default AddContract;
