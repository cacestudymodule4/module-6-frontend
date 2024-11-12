import React, {useEffect, useState,} from 'react';
import {Form, Row, Col, Button, Navbar,} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import '../../assets/css/Contract.css';
import axios from "axios";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Footer from "./Footer";
import {NavbarApp} from "./Navbar";

function EditContract() {
    const navigate = useNavigate();
    const [ground, setGround] = useState([]);
    const [startDay, setStartDay] = useState('');
    const [endDay, setEndDay] = useState('');
    const location = useLocation();
    const [staff, setStaff] = useState([]);
    const [nameStaff, setNameStaff] = useState("");
    const [contract, setContract] = useState(location.state?.contract || null);
    const [term, setTerm] = useState('');
    useEffect(() => {
        async function getStaff() {
            try {
                const response = await axios.get("http://localhost:8080/api/staff/list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setStaff(response.data);
                setNameStaff(contract.staff.name);
                setEndDay(contract.endDate);
                setStartDay(contract.startDate);

                setTerm(contract.term);
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
            } catch (error) {
                console.log(error);
            }
        }

        getGround();
        getStaff();
    }, [])
    const validationSchema = Yup.object().shape({
        content: Yup.string()
            .min(5, "Tối thiểu 5 ký tự")
            .max(300, "Tối đa 300 ký tự")
            .required('Không được trống'),
        staffId: Yup.string()
            .required('Không được trống.'),
        codeGround: Yup.string()
            .required('Không được trống'),
        term: Yup.number()
            .required('Không được trống')
            .min(3, 'Kỳ hạng tối thiểu 3 tháng')  // Tối thiểu 3
            .max(60, 'Kỳ hạng tối đa 60 tháng'),
        startDay: Yup.date()
            .required('Ngày bắt đầu là bắt buộc')
            .min(new Date(), 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại'),
    });
    const handleTermChange = (event) => {
        const termValue = event.target.value;
        setTerm(termValue);
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
        staffId: contract.staff.id,
        nameStaff: contract.staff.name,
        term: contract.term,
        codeGround: contract.ground.id,
        startDay: contract.startDate,
        content: contract.description,
        endDay: contract.endDate,
    };
    const calculateEndDate = (startDate, months) => {
        if (!startDate || !months) return '';
        const start = new Date(startDate);
        start.setMonth(start.getMonth() + parseInt(months));
        return start.toISOString().split('T')[0];  // Định dạng lại thành "YYYY-MM-DD"
    };
    const handleStaffChange = (event) => {
        const selectedIdStaff = event.target.value;
        const selectedStaff = staff.find(st => st.id === Number(selectedIdStaff));
        if (selectedStaff) {
            setNameStaff(selectedStaff.name);
        } else {
            setNameStaff(contract.staff.name);
        }
    };
    const handleSaveContract = async (value) => {
        try {
            const data = {
                id: contract.id,
                staffId: value.staffId || contract.staff.id,
                term: term,
                ground: value.codeGround || contract.ground.id,
                startDay: startDay,
                endDay: endDay,
                content: value.content
            }
            console.log(contract.staff.id)
            const res = await axios.put(`http://localhost:8080/api/contract/save`, data, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            navigate('/contract/list')
            toast.success("Chinh sữa thành công");
        } catch (error) {
            console.log(error)
            toast.error("sữa thât bại");
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
                    onSubmit={handleSaveContract}
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                >
                    {({values, setFieldValue}) => (
                        <FormikForm>
                            <Row>
                                <Col md={4}>
                                    <Form.Label>Chọn mã nhân viên</Form.Label>
                                    <Field as="select" name="staffId" className="form-control custom-date-input"
                                           value={values.staffId}
                                           onChange={(e) => {
                                               handleStaffChange(e);
                                               setFieldValue('staffId', e.target.value);
                                           }}
                                    >
                                        <option value={contract.staff.id} selected={true}>NV{contract.staff.id}</option>
                                        {staff.map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                NV{staff.id}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="staffId"
                                        component="div"
                                        className="error-message text-danger"
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên Nhân viên</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder=""
                                            name="nameStaff"
                                            className={"custom-date-input"}
                                            value={nameStaff}
                                        />
                                        <ErrorMessage
                                            name="nameStaff"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Label>Chọn mã mặt bằng</Form.Label>
                                    <Field as="select" name="codeGround" className="form-control custom-date-input"
                                           value={values.codeGround}
                                           onChange={(e) => {
                                               setFieldValue('codeGround', e.target.value);
                                           }}
                                    >
                                        <option value={contract.ground.id}
                                                selected={true}>MB{contract.ground.id}</option>
                                        {ground.map((ground) => (
                                            <option key={ground.id} value={ground.id}>
                                                MB{ground.id}
                                            </option>
                                        ))}
                                    </Field>
                                </Col>

                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nhập kì hạn (tháng)</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder=""
                                            name="term"
                                            className={"custom-date-input"}
                                            value={term}
                                            onChange={(e) => {
                                                setFieldValue('term', e.target.value);
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
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Chọn ngày bắt đầu thuê</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="date"
                                            name="startDay"
                                            value={startDay}
                                            className={"custom-date-input"}
                                            onChange={(e) => {
                                                setFieldValue('startDay', e.target.value);
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
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày kết thúc</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="date"
                                            name="endDay"
                                            value={endDay}
                                            className={"custom-date-input"}
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
                                            defaultValue={contract.description}
                                            // value={values.content || contract.description}
                                            onChange={(e) => {
                                                setFieldValue('content', e.target.value);
                                            }}
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
                                Lưu hợp đồng </Button>
                            <Button className={"ms-3"} variant="secondary" type="button"
                                    onClick={() => navigate('/contract/list')}>
                                Quay lại
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </div>
            <Footer/>
        </>
    )

}

export default EditContract;