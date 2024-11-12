import React, {useEffect, useState} from "react";
import {Form, Button, Row, Col} from 'react-bootstrap';
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import axios from "axios";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import Footer from "./Footer";
import {NavbarApp} from "./Navbar";

function AddContract() {
    const navigate = useNavigate();
    const [ground, setGround] = useState([]);
    const [staff, setStaff] = useState([]);
    const [nameStaff, setNameStaff] = useState('');
    const [customer, setCustomer] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [priceGround, setPriceGround] = useState('');
    const [startDay, setStartDay] = useState('');
    const [endDay, setEndDay] = useState('');
    const [term, setTerm] = useState('');

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

        async function getCustomer() {
            try {
                const response = await axios.get("http://localhost:8080/api/customer/list", {
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
            } catch (error) {
                console.log(error);
            }
        }

        getCustomer();
        getGround();
        getStaff();
    }, []);
    const handleAddContract = async (value,{resetForm}) => {
        try {
            const data = {
                cmd: value.cmd,
                staffId: value.staffId,
                term: value.term,
                ground: value.ground,
                startDay: value.startDay,
                endDay: endDay,
                price: priceGround,
                deposit: value.deposit,
                content: value.content,
            }
            const res = await axios.post(`http://localhost:8080/api/contract/add`, data, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                },
            )
            if (res.status === 200) {
                toast.success("Thêm mới thành công");
                resetForm();
                setEndDay("");
                setCustomerName("");
                setPriceGround("");
                setNameStaff("");

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
        cmd: '',
        staffId: '',
        term: '',
        nameStaff: '',
        ground: '',
        startDay: '',
        price: '',
        endDay: '',
        deposit: '',
        content: ''
    };
    const validationSchema = Yup.object().shape({
        content: Yup.string()
            .min(5, "Tối thiểu 5 ký tự")
            .max(300, "Tối đa 300 ký tự")
            .required('Không được trống'),
        cmd: Yup.string()
            .required('Không được trống.'),
        staffId: Yup.string()
            .required('Không được trống.'),
        ground: Yup.string()
            .required('Không được trống'),
        deposit: Yup.number()
            .min(50000000, 'Tối thiểu 5 triệu đồng.')
            .required('Không được trống'),
        term: Yup.number()
            .required('Không được trống')
            .min(3, 'Kỳ hạng tối thiểu 3 tháng')  // Tối thiểu 3
            .max(60, 'Kỳ hạng tối đa 60 tháng'),
        startDay: Yup.date()
            .required('Ngày bắt đầu là bắt buộc')
            .min(new Date(), 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại'),
    });
    const handleIdentificationChange = (event) => {
        const selectedId = event.target.value;
        const selectedCustomer = customer.find(cus => cus.identification === selectedId);
        if (selectedCustomer) {
            setCustomerName(selectedCustomer.name);
        } else {
            setCustomerName('');
        }
    };
    const handleStaffChange = (event) => {
        const selectedIdStaff = event.target.value;
        const selectedStaff = staff.find(st => st.id === Number(selectedIdStaff));
        if (selectedStaff) {
            setNameStaff(selectedStaff.name);
        } else {
            setCustomerName('');
        }
    };
    const handlePriceChange = (event) => {
        const selectedCode = event.target.value;
        const selectedGround = ground.find(grd => grd.id === Number(selectedCode));
        if (selectedGround) {
            setPriceGround(selectedGround.price);
        } else {
            setPriceGround('');
            toast.error("Không tìm thấy mặt bằng với mã đã chọn!");
        }
    };
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
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                >
                    {({values, setFieldValue}) => (
                        <FormikForm>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>CMND khách hàng</Form.Label>
                                        <Field as="select"
                                               name="cmd"
                                               className="form-control custom-date-input"
                                               value={values.cmd}  // Đồng bộ hóa giá trị với Formik
                                               onChange={(e) => {
                                                   handleIdentificationChange(e);
                                                   setFieldValue('cmd', e.target.value); // Cập nhật giá trị trong Formik state
                                               }}
                                        >
                                            <option value="">Chọn CMND</option>
                                            {customer.map((cus) => (
                                                <option key={cus.id} value={cus.identification}>
                                                    {cus.identification}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="cmd"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên khách hàng</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            className="form-control custom-date-input readonly-input "
                                            name={"nameCus"}
                                            value={customerName}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mặt bằng</Form.Label>
                                        <Field as="select" name="ground" className="form-control custom-date-input"
                                               value={values.ground}
                                               onChange={(e) => {
                                                   handlePriceChange(e);
                                                   setFieldValue('ground', e.target.value);
                                               }}>
                                            <option value=""> Chọn mã mặt bằng</option>
                                            {ground.map((ground) => (
                                                <option key={ground.id} value={ground.id}>
                                                    MB{ground.id}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="ground"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kỳ hạng (tháng)</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            name="term"
                                            className="custom-date-input"
                                            value={values.term}
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
                                        <Form.Label>Ngày bắt đầu thuê</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="date"
                                            name="startDay"
                                            value={values.startDay}
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
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Giá tiền mỗi tháng (VNĐ)</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="number"
                                            name="price"
                                            className={"custom-date-input readonly-input"}
                                            value={priceGround}
                                            readOnly/>
                                        <ErrorMessage
                                            name="price"
                                            component="div"
                                            className="error-message text-danger"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tiền cọc(VNĐ)</Form.Label>
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
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mã nhân viên</Form.Label>
                                        <Field as="select" name="staffId" className="form-control custom-date-input"
                                               value={values.staffId}
                                               onChange={(e) => {
                                                   handleStaffChange(e);
                                                   setFieldValue('staffId', e.target.value);
                                               }}
                                        >
                                            <option value="">Chọn mã nhân viên</option>
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
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên Nhân viên</Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            placeholder=""
                                            name="nameStaff"
                                            className={"custom-date-input readonly-input "}
                                            value={nameStaff}
                                        />
                                        <ErrorMessage
                                            name="nameStaff"
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
            <Footer/>
        </>

    );
}

export default AddContract;
